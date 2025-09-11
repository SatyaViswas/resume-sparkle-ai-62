export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      interview_questions: {
        Row: {
          created_at: string | null
          id: string
          job_role: string
          question: string
          question_type: string
          sample_answer: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_role: string
          question: string
          question_type: string
          sample_answer?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_role?: string
          question?: string
          question_type?: string
          sample_answer?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string | null
          company: string
          id: string
          job_title: string
          job_url: string | null
          location: string | null
          salary: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          company: string
          id?: string
          job_title: string
          job_url?: string | null
          location?: string | null
          salary?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          company?: string
          id?: string
          job_title?: string
          job_url?: string | null
          location?: string | null
          salary?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mentor_feedback: {
        Row: {
          comments: string | null
          created_at: string | null
          id: string
          mentor_id: string
          rating: number | null
          resume_id: string
          student_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          id?: string
          mentor_id: string
          rating?: number | null
          resume_id: string
          student_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          id?: string
          mentor_id?: string
          rating?: number | null
          resume_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_feedback_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          job_preferences: string | null
          onboarding_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          skills: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          job_preferences?: string | null
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          job_preferences?: string | null
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resume_scans: {
        Row: {
          analysis: Json | null
          ats_score: number | null
          created_at: string | null
          extracted_text: string | null
          id: string
          original_filename: string
          suggestions: string[] | null
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          ats_score?: number | null
          created_at?: string | null
          extracted_text?: string | null
          id?: string
          original_filename: string
          suggestions?: string[] | null
          user_id: string
        }
        Update: {
          analysis?: Json | null
          ats_score?: number | null
          created_at?: string | null
          extracted_text?: string | null
          id?: string
          original_filename?: string
          suggestions?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          certifications: Json[] | null
          created_at: string | null
          education: Json[] | null
          id: string
          is_active: boolean | null
          personal_details: Json | null
          projects: Json[] | null
          skills: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          work_experience: Json[] | null
        }
        Insert: {
          certifications?: Json[] | null
          created_at?: string | null
          education?: Json[] | null
          id?: string
          is_active?: boolean | null
          personal_details?: Json | null
          projects?: Json[] | null
          skills?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          work_experience?: Json[] | null
        }
        Update: {
          certifications?: Json[] | null
          created_at?: string | null
          education?: Json[] | null
          id?: string
          is_active?: boolean | null
          personal_details?: Json | null
          projects?: Json[] | null
          skills?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          work_experience?: Json[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "student" | "mentor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["student", "mentor"],
    },
  },
} as const
