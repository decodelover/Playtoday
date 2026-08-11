export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Supabase's client generic requires this generated-style structural alias.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Database = {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string;
          email: string;
          enquiry_type: string;
          id: string;
          message: string;
          name: string;
          status: string;
          subject: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          enquiry_type: string;
          id?: string;
          message: string;
          name: string;
          status?: string;
          subject: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          enquiry_type?: string;
          id?: string;
          message?: string;
          name?: string;
          status?: string;
          subject?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          onboarding_completed_at: string | null;
          onboarding_step: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          onboarding_completed_at?: string | null;
          onboarding_step?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          onboarding_completed_at?: string | null;
          onboarding_step?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          created_at: string;
          default_strategy: string;
          notification_channels: Json;
          preferred_bookmakers: string[];
          preferred_markets: string[];
          preferred_sports: string[];
          responsible_play_ack: boolean;
          risk_preference: string;
          target_odds: number;
          timezone: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          default_strategy?: string;
          notification_channels?: Json;
          preferred_bookmakers?: string[];
          preferred_markets?: string[];
          preferred_sports?: string[];
          responsible_play_ack?: boolean;
          risk_preference?: string;
          target_odds?: number;
          timezone?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          default_strategy?: string;
          notification_channels?: Json;
          preferred_bookmakers?: string[];
          preferred_markets?: string[];
          preferred_sports?: string[];
          responsible_play_ack?: boolean;
          risk_preference?: string;
          target_odds?: number;
          timezone?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      complete_onboarding: {
        Args: {
          p_default_strategy: string;
          p_notification_channels: Json;
          p_preferred_bookmakers: string[];
          p_preferred_markets: string[];
          p_preferred_sports: string[];
          p_responsible_play_ack: boolean;
          p_risk_preference: string;
          p_target_odds: number;
          p_timezone: string;
        };
        Returns: string;
      };
      save_onboarding_progress: {
        Args: {
          p_default_strategy: string;
          p_notification_channels: Json;
          p_preferred_bookmakers: string[];
          p_preferred_markets: string[];
          p_preferred_sports: string[];
          p_responsible_play_ack: boolean;
          p_risk_preference: string;
          p_step: string;
          p_target_odds: number;
          p_timezone: string;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
