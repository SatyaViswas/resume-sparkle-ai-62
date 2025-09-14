import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generate interview questions function called');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, resumeText, targetRole, extractedSkills, careerPaths, analysisData } = await req.json();

    console.log('Generating questions for user:', userId || 'guest', 'role:', targetRole);

    // Generate interview questions with Cohere
    const cohereKey = Deno.env.get('COHERE_API_KEY');
    if (!cohereKey) {
      throw new Error('Cohere API key not configured');
    }

    // Build context from resume analysis
    const skillsContext = extractedSkills && extractedSkills.length > 0 
      ? `Key Skills: ${extractedSkills.join(', ')}`
      : '';
    
    const careerContext = careerPaths && careerPaths.length > 0
      ? `Suggested Career Paths: ${careerPaths.map(path => `${path.title} (${path.match_percentage}% match)`).join(', ')}`
      : '';
    
    const strengthsContext = analysisData?.strengths 
      ? `Key Strengths: ${analysisData.strengths.join(', ')}`
      : '';

    const questionsPrompt = `Generate 6-7 interview questions for a ${targetRole || 'software developer'} position based on this resume analysis. 
    
    Include a mix of:
    - 2-3 behavioral questions (teamwork, challenges, achievements) - focus on their strengths
    - 2-3 technical questions (skills, problem-solving, technical knowledge) - based on their specific skills
    - 1-2 situational questions (scenarios they might face) - relevant to the target role

    ${skillsContext}
    ${careerContext}
    ${strengthsContext}

    Make questions specific to their background and skills. For technical questions, focus on the technologies and skills they actually have.

    Return ONLY a JSON array of strings (just the questions):
    ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6"]

    Resume context:
    ${resumeText || 'No resume text provided - generate general questions for the role.'}`;

    console.log('Calling Cohere for question generation...');

    let questions;
    try {
      const response = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cohereKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          message: questionsPrompt,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cohere request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const questionsText = data.text;
      
      try {
        questions = JSON.parse(questionsText);
      } catch (e) {
        console.log('Failed to parse JSON, retrying with schema reminder');
        // Retry with schema reminder
        const retryResponse = await fetch('https://api.cohere.com/v1/chat', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cohereKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'command-r-plus',
            message: `You must return ONLY a valid JSON array of strings. ${questionsPrompt}`,
            temperature: 0.5,
          }),
        });

        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          try {
            questions = JSON.parse(retryData.text);
          } catch (e2) {
            console.log('Second JSON parse failed, using fallback questions');
            questions = [
              "Tell me about a time when you had to work with a difficult team member.",
              "How would you optimize the performance of a React application?",
              "Describe a project you're most proud of and why.",
              "How would you handle a situation where a project deadline is at risk?",
              "Explain the difference between server-side and client-side rendering.",
              "How would you approach learning a new technology for a project?"
            ];
          }
        } else {
          throw new Error('Cohere question generation failed');
        }
      }
    } catch (cohereError) {
      console.error('Cohere question generation failed:', cohereError);
      // Fallback questions if Cohere fails
      questions = [
        "Tell me about a time when you had to work with a difficult team member.",
        "How would you optimize the performance of a React application?",
        "Describe a project you're most proud of and why.",
        "How would you handle a situation where a project deadline is at risk?",
        "Explain the difference between server-side and client-side rendering.",
        "How would you approach learning a new technology for a project?"
      ];
    }

    console.log('Generated', questions.length, 'questions');

    // Save questions to database (only if user is authenticated)
    if (userId) {
      try {
        const questionPromises = questions.map((question: string) => 
          supabaseClient
            .from('interview_questions')
            .insert({
              user_id: userId,
              question: question,
              question_type: 'Mixed',
              job_role: targetRole || 'Software Developer',
              sample_answer: null
            })
        );

        await Promise.all(questionPromises);
        console.log('Questions saved to database successfully');
      } catch (e) {
        console.log('Failed to save questions to database:', e);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      questions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-interview-questions function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});