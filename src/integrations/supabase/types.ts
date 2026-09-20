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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          category: string
          created_at: string
          description: string
          expiry_date: string | null
          featured: boolean
          id: string
          image_path: string | null
          publish_date: string
          show_banner: boolean
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          expiry_date?: string | null
          featured?: boolean
          id?: string
          image_path?: string | null
          publish_date?: string
          show_banner?: boolean
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          expiry_date?: string | null
          featured?: boolean
          id?: string
          image_path?: string | null
          publish_date?: string
          show_banner?: boolean
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      application_status_history: {
        Row: {
          application_id: string
          changed_by: string | null
          created_at: string
          id: string
          note: string | null
          status: string
        }
        Insert: {
          application_id: string
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          status: string
        }
        Update: {
          application_id?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          email: string
          experience: string | null
          full_name: string
          github: string | null
          id: string
          linkedin: string | null
          location: string | null
          notes: string | null
          phone: string
          portfolio: string | null
          position_id: string | null
          position_title: string
          position_type: string
          qualification: string | null
          resume_path: string | null
          skills: string | null
          status: string
          updated_at: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          email: string
          experience?: string | null
          full_name: string
          github?: string | null
          id?: string
          linkedin?: string | null
          location?: string | null
          notes?: string | null
          phone: string
          portfolio?: string | null
          position_id?: string | null
          position_title: string
          position_type: string
          qualification?: string | null
          resume_path?: string | null
          skills?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          email?: string
          experience?: string | null
          full_name?: string
          github?: string | null
          id?: string
          linkedin?: string | null
          location?: string | null
          notes?: string | null
          phone?: string
          portfolio?: string | null
          position_id?: string | null
          position_title?: string
          position_type?: string
          qualification?: string | null
          resume_path?: string | null
          skills?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          created_at: string
          discount_price: number | null
          duration: string
          featured: boolean
          full_description: string
          id: string
          instructor: string | null
          language: string
          level: string
          price: number
          published_at: string | null
          short_description: string
          slug: string
          status: string
          thumbnail_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          discount_price?: number | null
          duration?: string
          featured?: boolean
          full_description?: string
          id?: string
          instructor?: string | null
          language?: string
          level?: string
          price?: number
          published_at?: string | null
          short_description?: string
          slug: string
          status?: string
          thumbnail_path?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          discount_price?: number | null
          duration?: string
          featured?: boolean
          full_description?: string
          id?: string
          instructor?: string | null
          language?: string
          level?: string
          price?: number
          published_at?: string | null
          short_description?: string
          slug?: string
          status?: string
          thumbnail_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hiring_requests: {
        Row: {
          additional_requirements: string
          company_name: string
          contact_person: string
          created_at: string
          email: string
          experience: string
          id: string
          job_type: string
          joining_timeline: string
          location: string
          openings: number
          phone: string
          position: string
          qualification: string
          required_skills: string
          salary_range: string
          status: string
          updated_at: string
        }
        Insert: {
          additional_requirements?: string
          company_name: string
          contact_person: string
          created_at?: string
          email: string
          experience?: string
          id?: string
          job_type?: string
          joining_timeline?: string
          location?: string
          openings?: number
          phone?: string
          position: string
          qualification?: string
          required_skills?: string
          salary_range?: string
          status?: string
          updated_at?: string
        }
        Update: {
          additional_requirements?: string
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          experience?: string
          id?: string
          job_type?: string
          joining_timeline?: string
          location?: string
          openings?: number
          phone?: string
          position?: string
          qualification?: string
          required_skills?: string
          salary_range?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      internships: {
        Row: {
          application_deadline: string | null
          created_at: string
          department: string
          description: string
          duration: string
          eligibility: string
          experience_level: string
          featured: boolean
          id: string
          location: string
          openings: number
          published_at: string | null
          requirements: string
          responsibilities: string
          skills: string[]
          slug: string
          status: string
          stipend: string
          title: string
          updated_at: string
          work_mode: string
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string
          department?: string
          description?: string
          duration?: string
          eligibility?: string
          experience_level?: string
          featured?: boolean
          id?: string
          location?: string
          openings?: number
          published_at?: string | null
          requirements?: string
          responsibilities?: string
          skills?: string[]
          slug: string
          status?: string
          stipend?: string
          title: string
          updated_at?: string
          work_mode?: string
        }
        Update: {
          application_deadline?: string | null
          created_at?: string
          department?: string
          description?: string
          duration?: string
          eligibility?: string
          experience_level?: string
          featured?: boolean
          id?: string
          location?: string
          openings?: number
          published_at?: string | null
          requirements?: string
          responsibilities?: string
          skills?: string[]
          slug?: string
          status?: string
          stipend?: string
          title?: string
          updated_at?: string
          work_mode?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          application_deadline: string | null
          benefits: string
          created_at: string
          department: string
          description: string
          employment_type: string
          experience: string
          featured: boolean
          id: string
          location: string
          openings: number
          published_at: string | null
          requirements: string
          responsibilities: string
          salary_range: string
          skills: string[]
          slug: string
          status: string
          title: string
          updated_at: string
          work_mode: string
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string
          created_at?: string
          department?: string
          description?: string
          employment_type?: string
          experience?: string
          featured?: boolean
          id?: string
          location?: string
          openings?: number
          published_at?: string | null
          requirements?: string
          responsibilities?: string
          salary_range?: string
          skills?: string[]
          slug: string
          status?: string
          title: string
          updated_at?: string
          work_mode?: string
        }
        Update: {
          application_deadline?: string | null
          benefits?: string
          created_at?: string
          department?: string
          description?: string
          employment_type?: string
          experience?: string
          featured?: boolean
          id?: string
          location?: string
          openings?: number
          published_at?: string | null
          requirements?: string
          responsibilities?: string
          salary_range?: string
          skills?: string[]
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          work_mode?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      organization_registrations: {
        Row: {
          contact_person: string
          created_at: string
          email: string
          headcount: number
          hiring_requirements: string
          id: string
          location: string
          message: string
          org_name: string
          org_type: string
          phone: string
          preferred_program: string
          requirements: string
          status: string
          training_requirements: string
          updated_at: string
        }
        Insert: {
          contact_person: string
          created_at?: string
          email: string
          headcount?: number
          hiring_requirements?: string
          id?: string
          location?: string
          message?: string
          org_name: string
          org_type?: string
          phone?: string
          preferred_program?: string
          requirements?: string
          status?: string
          training_requirements?: string
          updated_at?: string
        }
        Update: {
          contact_person?: string
          created_at?: string
          email?: string
          headcount?: number
          hiring_requirements?: string
          id?: string
          location?: string
          message?: string
          org_name?: string
          org_type?: string
          phone?: string
          preferred_program?: string
          requirements?: string
          status?: string
          training_requirements?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          education: string | null
          full_name: string | null
          github: string | null
          id: string
          linkedin: string | null
          location: string | null
          phone: string | null
          portfolio: string | null
          resume_path: string | null
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          education?: string | null
          full_name?: string | null
          github?: string | null
          id: string
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          portfolio?: string | null
          resume_path?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          education?: string | null
          full_name?: string | null
          github?: string | null
          id?: string
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          portfolio?: string | null
          resume_path?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          item_id: string | null
          item_title: string
          item_type: string
          message: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          item_id?: string | null
          item_title: string
          item_type: string
          message?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          item_id?: string | null
          item_title?: string
          item_type?: string
          message?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_positions: {
        Row: {
          created_at: string
          id: string
          position_id: string
          position_title: string
          position_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          position_id: string
          position_title?: string
          position_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          position_id?: string
          position_title?: string
          position_type?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string
          created_at: string
          display_order: number
          github: string | null
          id: string
          linkedin: string | null
          name: string
          photo_path: string | null
          published: boolean
          role: string
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          display_order?: number
          github?: string | null
          id?: string
          linkedin?: string | null
          name: string
          photo_path?: string | null
          published?: boolean
          role: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          display_order?: number
          github?: string | null
          id?: string
          linkedin?: string | null
          name?: string
          photo_path?: string | null
          published?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          course: string
          created_at: string
          id: string
          name: string
          photo_path: string | null
          published: boolean
          quote: string
          rating: number
          updated_at: string
        }
        Insert: {
          course?: string
          created_at?: string
          id?: string
          name: string
          photo_path?: string | null
          published?: boolean
          quote: string
          rating?: number
          updated_at?: string
        }
        Update: {
          course?: string
          created_at?: string
          id?: string
          name?: string
          photo_path?: string | null
          published?: boolean
          quote?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      training_programs: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string
          eligibility: string
          featured: boolean
          id: string
          mode: string
          price: number
          published_at: string | null
          skills: string[]
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          eligibility?: string
          featured?: boolean
          id?: string
          mode?: string
          price?: number
          published_at?: string | null
          skills?: string[]
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          eligibility?: string
          featured?: boolean
          id?: string
          mode?: string
          price?: number
          published_at?: string | null
          skills?: string[]
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      recent_application_exists: {
        Args: { _email: string; _position_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "content_manager" | "recruiter" | "trainer"
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
      app_role: ["super_admin", "content_manager", "recruiter", "trainer"],
    },
  },
} as const
