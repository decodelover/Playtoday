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
      sports: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          key: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: string;
          key: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          key?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      areas: {
        Row: {
          code: string | null;
          created_at: string;
          flag_url: string | null;
          id: string;
          key: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          flag_url?: string | null;
          id?: string;
          key: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          flag_url?: string | null;
          id?: string;
          key?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      competitions: {
        Row: {
          active: boolean;
          area_id: string | null;
          canonical_key: string;
          created_at: string;
          id: string;
          logo_url: string | null;
          name: string;
          short_name: string | null;
          sport_id: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          area_id?: string | null;
          canonical_key: string;
          created_at?: string;
          id?: string;
          logo_url?: string | null;
          name: string;
          short_name?: string | null;
          sport_id: string;
          type?: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          area_id?: string | null;
          canonical_key?: string;
          created_at?: string;
          id?: string;
          logo_url?: string | null;
          name?: string;
          short_name?: string | null;
          sport_id?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      seasons: {
        Row: {
          competition_id: string;
          created_at: string;
          current: boolean;
          end_date: string | null;
          id: string;
          name: string;
          start_date: string | null;
          updated_at: string;
        };
        Insert: {
          competition_id: string;
          created_at?: string;
          current?: boolean;
          end_date?: string | null;
          id?: string;
          name: string;
          start_date?: string | null;
          updated_at?: string;
        };
        Update: {
          competition_id?: string;
          created_at?: string;
          current?: boolean;
          end_date?: string | null;
          id?: string;
          name?: string;
          start_date?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          active: boolean;
          area_id: string | null;
          canonical_name: string;
          code: string | null;
          created_at: string;
          id: string;
          logo_url: string | null;
          short_name: string | null;
          sport_id: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          area_id?: string | null;
          canonical_name: string;
          code?: string | null;
          created_at?: string;
          id?: string;
          logo_url?: string | null;
          short_name?: string | null;
          sport_id: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          area_id?: string | null;
          canonical_name?: string;
          code?: string | null;
          created_at?: string;
          id?: string;
          logo_url?: string | null;
          short_name?: string | null;
          sport_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      venues: {
        Row: {
          capacity: number | null;
          city: string | null;
          country: string | null;
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          capacity?: number | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          capacity?: number | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      fixtures: {
        Row: {
          away_score: number | null;
          away_team_id: string;
          competition_id: string;
          created_at: string;
          ended_at: string | null;
          halftime_away_score: number | null;
          halftime_home_score: number | null;
          home_score: number | null;
          home_team_id: string;
          id: string;
          kickoff_at: string;
          last_synced_at: string;
          matchday: number | null;
          round: string | null;
          season_id: string | null;
          source_updated_at: string | null;
          sport_id: string;
          stage: string | null;
          started_at: string | null;
          status: string;
          status_detail: string | null;
          updated_at: string;
          venue_id: string | null;
        };
        Insert: {
          away_score?: number | null;
          away_team_id: string;
          competition_id: string;
          created_at?: string;
          ended_at?: string | null;
          halftime_away_score?: number | null;
          halftime_home_score?: number | null;
          home_score?: number | null;
          home_team_id: string;
          id?: string;
          kickoff_at: string;
          last_synced_at?: string;
          matchday?: number | null;
          round?: string | null;
          season_id?: string | null;
          source_updated_at?: string | null;
          sport_id: string;
          stage?: string | null;
          started_at?: string | null;
          status?: string;
          status_detail?: string | null;
          updated_at?: string;
          venue_id?: string | null;
        };
        Update: {
          away_score?: number | null;
          away_team_id?: string;
          competition_id?: string;
          created_at?: string;
          ended_at?: string | null;
          halftime_away_score?: number | null;
          halftime_home_score?: number | null;
          home_score?: number | null;
          home_team_id?: string;
          id?: string;
          kickoff_at?: string;
          last_synced_at?: string;
          matchday?: number | null;
          round?: string | null;
          season_id?: string | null;
          source_updated_at?: string | null;
          sport_id?: string;
          stage?: string | null;
          started_at?: string | null;
          status?: string;
          status_detail?: string | null;
          updated_at?: string;
          venue_id?: string | null;
        };
        Relationships: [];
      };
      provider_entity_mappings: {
        Row: {
          canonical_entity_id: string;
          created_at: string;
          entity_type: string;
          id: string;
          provider: string;
          provider_entity_id: string;
          source_last_seen_at: string;
          updated_at: string;
        };
        Insert: {
          canonical_entity_id: string;
          created_at?: string;
          entity_type: string;
          id?: string;
          provider: string;
          provider_entity_id: string;
          source_last_seen_at?: string;
          updated_at?: string;
        };
        Update: {
          canonical_entity_id?: string;
          created_at?: string;
          entity_type?: string;
          id?: string;
          provider?: string;
          provider_entity_id?: string;
          source_last_seen_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      provider_payloads: {
        Row: {
          created_at: string;
          endpoint: string;
          fetched_at: string;
          id: string;
          payload_hash: string;
          provider: string;
          raw_payload: Json;
        };
        Insert: {
          created_at?: string;
          endpoint: string;
          fetched_at?: string;
          id?: string;
          payload_hash: string;
          provider: string;
          raw_payload: Json;
        };
        Update: {
          created_at?: string;
          endpoint?: string;
          fetched_at?: string;
          id?: string;
          payload_hash?: string;
          provider?: string;
          raw_payload?: Json;
        };
        Relationships: [];
      };
      sports_ingestion_runs: {
        Row: {
          completed_at: string | null;
          created_at: string;
          created_count: number;
          error_summary: string | null;
          failed_count: number;
          fetched_count: number;
          id: string;
          job_type: string;
          provider: string;
          started_at: string;
          status: string;
          updated_count: number;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          created_count?: number;
          error_summary?: string | null;
          failed_count?: number;
          fetched_count?: number;
          id?: string;
          job_type: string;
          provider: string;
          started_at?: string;
          status?: string;
          updated_count?: number;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          created_count?: number;
          error_summary?: string | null;
          failed_count?: number;
          fetched_count?: number;
          id?: string;
          job_type?: string;
          provider?: string;
          started_at?: string;
          status?: string;
          updated_count?: number;
        };
        Relationships: [];
      };
      sports_provider_health: {
        Row: {
          consecutive_failures: number;
          created_at: string;
          id: string;
          last_error: string | null;
          last_failure_at: string | null;
          last_successful_sync_at: string | null;
          provider: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          consecutive_failures?: number;
          created_at?: string;
          id?: string;
          last_error?: string | null;
          last_failure_at?: string | null;
          last_successful_sync_at?: string | null;
          provider: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          consecutive_failures?: number;
          created_at?: string;
          id?: string;
          last_error?: string | null;
          last_failure_at?: string | null;
          last_successful_sync_at?: string | null;
          provider?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      v_public_fixtures: {
        Row: {
          away_score: number | null;
          away_team_id: string;
          away_team_logo_url: string | null;
          away_team_name: string;
          away_team_short_name: string | null;
          competition_id: string;
          competition_key: string;
          competition_logo_url: string | null;
          competition_name: string;
          halftime_away_score: number | null;
          halftime_home_score: number | null;
          home_score: number | null;
          home_team_id: string;
          home_team_logo_url: string | null;
          home_team_name: string;
          home_team_short_name: string | null;
          id: string;
          kickoff_at: string;
          last_synced_at: string;
          matchday: number | null;
          round: string | null;
          stage: string | null;
          status: string;
          status_detail: string | null;
          venue_city: string | null;
          venue_name: string | null;
        };
        Relationships: [];
      };
    };
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
