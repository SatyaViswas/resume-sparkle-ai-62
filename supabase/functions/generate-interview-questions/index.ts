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

    const { userId, resumeText, targetRole } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Generating questions for user:', userId, 'role:', targetRole);

    // Generate interview questions with OpenRouter
    const openrouterKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const questionsPrompt = `Generate 6-7 interview questions for a ${targetRole || 'software developer'} position based on this resume. 
    
    Include a mix of:
    - 2-3 behavioral questions (teamwork, challenges, achievements)
    - 2-3 technical questions (skills, problem-solving, technical knowledge)
    - 1-2 situational questions (scenarios they might face)

    Return ONLY a JSON array of objects in this format:
    [
      {
        "question": "Tell me about a time when you had to work with a difficult team member.",
        "type": "Behavioral",
        "category": "teamwork"
      },
      {
        "question": "How would you optimize the performance of a React application?",
        "type": "Technical", 
        "category": "frontend"
      }
    ]

    Resume context:
    ${resumeText || 'No resume text provided - generate general questions for the role.'}`;

    console.log('Calling OpenRouter for question generation...');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: questionsPrompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const questionsText = data.choices[0].message.content;
    
    let questions;
    try {
      questions = JSON.parse(questionsText);
    } catch (e) {
      console.log('Failed to parse JSON, using fallback questions');
      // Fallback questions if JSON parsing fails
      questions = [
        {
          question: "Tell me about a time when you had to work with a difficult team member.",
          type: "Behavioral",
          category: "teamwork"
        },
        {
          question: "How would you optimize the performance of a React application?",
          type: "Technical",
          category: "frontend"
        },
        {
          question: "Describe a project you're most proud of and why.",
          type: "Behavioral", 
          category: "achievements"
        },
        {
          question: "How would you handle a situation where a project deadline is at risk?",
          type: "Situational",
          category: "project-management"
        },
        {
          question: "Explain the difference between server-side and client-side rendering.",
          type: "Technical",
          category: "web-development"
        },
        {
          question: "How would you approach learning a new technology for a project?",
          type: "Situational",
          category: "learning"
        }
      ];
    }

    console.log('Generated', questions.length, 'questions');

    // Save questions to database
    const questionPromises = questions.map((q: any) => 
      supabaseClient
        .from('interview_questions')
        .insert({
          user_id: userId,
          question: q.question,
          question_type: q.type,
          job_role: targetRole || 'Software Developer',
          sample_answer: null
        })
    );

    await Promise.all(questionPromises);

    console.log('Questions saved to database successfully');

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