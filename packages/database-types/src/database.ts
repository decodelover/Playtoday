export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
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
      bookmaker_capabilities: {
        Row: {
          availability_status: string;
          booking_code_api: boolean;
          bookmaker_id: string;
          created_at: string;
          direct_integration: boolean;
          id: string;
          live_odds: boolean;
          odds_provider: string;
          pre_match_odds: boolean;
          source_reference: string | null;
          updated_at: string;
          verified_at: string | null;
        };
        Insert: {
          availability_status: string;
          booking_code_api?: boolean;
          bookmaker_id: string;
          created_at?: string;
          direct_integration?: boolean;
          id?: string;
          live_odds?: boolean;
          odds_provider: string;
          pre_match_odds?: boolean;
          source_reference?: string | null;
          updated_at?: string;
          verified_at?: string | null;
        };
        Update: {
          availability_status?: string;
          booking_code_api?: boolean;
          bookmaker_id?: string;
          created_at?: string;
          direct_integration?: boolean;
          id?: string;
          live_odds?: boolean;
          odds_provider?: string;
          pre_match_odds?: boolean;
          source_reference?: string | null;
          updated_at?: string;
          verified_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookmaker_capabilities_bookmaker_id_fkey";
            columns: ["bookmaker_id"];
            isOneToOne: false;
            referencedRelation: "bookmakers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookmaker_capabilities_bookmaker_id_fkey";
            columns: ["bookmaker_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["bookmaker_id"];
          },
        ];
      };
      bookmakers: {
        Row: {
          active: boolean;
          canonical_key: string;
          created_at: string;
          id: string;
          name: string;
          region_code: string | null;
          updated_at: string;
          website_domain: string | null;
        };
        Insert: {
          active?: boolean;
          canonical_key: string;
          created_at?: string;
          id?: string;
          name: string;
          region_code?: string | null;
          updated_at?: string;
          website_domain?: string | null;
        };
        Update: {
          active?: boolean;
          canonical_key?: string;
          created_at?: string;
          id?: string;
          name?: string;
          region_code?: string | null;
          updated_at?: string;
          website_domain?: string | null;
        };
        Relationships: [];
      };
      canonical_markets: {
        Row: {
          active: boolean;
          canonical_key: string;
          created_at: string;
          id: string;
          name: string;
          parameter_kind: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          canonical_key: string;
          created_at?: string;
          id?: string;
          name: string;
          parameter_kind?: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          canonical_key?: string;
          created_at?: string;
          id?: string;
          name?: string;
          parameter_kind?: string;
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
        Relationships: [
          {
            foreignKeyName: "competitions_area_id_fkey";
            columns: ["area_id"];
            isOneToOne: false;
            referencedRelation: "areas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competitions_sport_id_fkey";
            columns: ["sport_id"];
            isOneToOne: false;
            referencedRelation: "sports";
            referencedColumns: ["id"];
          },
        ];
      };
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
      current_odds: {
        Row: {
          bookmaker_id: string;
          created_at: string;
          decimal_odds: number;
          fetched_at: string;
          first_observed_at: string;
          fixture_id: string;
          id: string;
          last_observed_at: string;
          line: number | null;
          market_id: string;
          market_status: string;
          participant: string | null;
          provider: string;
          provider_event_id: string;
          provider_market_id: string;
          provider_selection_key: string;
          selection_key: string;
          source_updated_at: string;
          updated_at: string;
        };
        Insert: {
          bookmaker_id: string;
          created_at?: string;
          decimal_odds: number;
          fetched_at: string;
          first_observed_at: string;
          fixture_id: string;
          id?: string;
          last_observed_at: string;
          line?: number | null;
          market_id: string;
          market_status?: string;
          participant?: string | null;
          provider: string;
          provider_event_id: string;
          provider_market_id: string;
          provider_selection_key: string;
          selection_key: string;
          source_updated_at: string;
          updated_at?: string;
        };
        Update: {
          bookmaker_id?: string;
          created_at?: string;
          decimal_odds?: number;
          fetched_at?: string;
          first_observed_at?: string;
          fixture_id?: string;
          id?: string;
          last_observed_at?: string;
          line?: number | null;
          market_id?: string;
          market_status?: string;
          participant?: string | null;
          provider?: string;
          provider_event_id?: string;
          provider_market_id?: string;
          provider_selection_key?: string;
          selection_key?: string;
          source_updated_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "current_odds_bookmaker_id_fkey";
            columns: ["bookmaker_id"];
            isOneToOne: false;
            referencedRelation: "bookmakers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "current_odds_bookmaker_id_fkey";
            columns: ["bookmaker_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["bookmaker_id"];
          },
          {
            foreignKeyName: "current_odds_fixture_id_fkey";
            columns: ["fixture_id"];
            isOneToOne: false;
            referencedRelation: "fixtures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "current_odds_fixture_id_fkey";
            columns: ["fixture_id"];
            isOneToOne: false;
            referencedRelation: "v_public_fixtures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "current_odds_market_id_fkey";
            columns: ["market_id"];
            isOneToOne: false;
            referencedRelation: "canonical_markets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "current_odds_market_id_fkey";
            columns: ["market_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["market_id"];
          },
        ];
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
          status: Database["public"]["Enums"]["fixture_status"];
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
          status?: Database["public"]["Enums"]["fixture_status"];
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
          status?: Database["public"]["Enums"]["fixture_status"];
          status_detail?: string | null;
          updated_at?: string;
          venue_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fixtures_away_team_id_fkey";
            columns: ["away_team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fixtures_away_team_id_fkey";
            columns: ["away_team_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["away_team_id"];
          },
          {
            foreignKeyName: "fixtures_away_team_id_fkey";
            columns: ["away_team_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["home_team_id"];
          },
          {
            foreignKeyName: "fixtures_away_team_id_fkey";
            columns: ["away_team_id"];
            isOneToOne: false;
            referencedRelation: "v_public_fixtures";
            referencedColumns: ["away_team_id"];
          },
          {
            foreignKeyName: "fixtures_away_team_id_fkey";
            columns: ["away_team_id"];
            isOneToOne: false;
            referencedRelation: "v_public_fixtures";
            referencedColumns: ["home_team_id"];
          },
          {
            foreignKeyName: "fixtures_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "competitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fixtures_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["competition_id"];
          },
          {
            foreignKeyName: "fixtures_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "v_public_fixtures";
            referencedColumns: ["competition_id"];
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey";
            columns: ["home_team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey";
            columns: ["home_team_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["away_team_id"];
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey";
            columns: ["home_team_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["home_team_id"];
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey";
            columns: ["home_team_id"];
            isOneToOne: false;
            referencedRelation: "v_public_fixtures";
            referencedColumns: ["away_team_id"];
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey";
            columns: ["home_team_id"];
            isOneToOne: false;
            referencedRelation: "v_public_fixtures";
            referencedColumns: ["home_team_id"];
          },
          {
            foreignKeyName: "fixtures_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "seasons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fixtures_sport_id_fkey";
            columns: ["sport_id"];
            isOneToOne: false;
            referencedRelation: "sports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fixtures_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
        ];
      };
      odds_ingestion_runs: {
        Row: {
          bookmakers_received: number;
          completed_at: string | null;
          created_at: string;
          current_prices_created: number;
          current_prices_updated: number;
          error_summary: string | null;
          events_received: number;
          failures: number;
          fixtures_requested: number;
          id: string;
          invalid_prices: number;
          job_type: string;
          markets_processed: number;
          provider: string;
          requests_used: number;
          selections_processed: number;
          snapshots_created: number;
          started_at: string;
          status: string;
          unchanged_prices: number;
          unmapped_bookmakers: number;
          unmapped_markets: number;
          unresolved_events: number;
        };
        Insert: {
          bookmakers_received?: number;
          completed_at?: string | null;
          created_at?: string;
          current_prices_created?: number;
          current_prices_updated?: number;
          error_summary?: string | null;
          events_received?: number;
          failures?: number;
          fixtures_requested?: number;
          id?: string;
          invalid_prices?: number;
          job_type: string;
          markets_processed?: number;
          provider: string;
          requests_used?: number;
          selections_processed?: number;
          snapshots_created?: number;
          started_at?: string;
          status?: string;
          unchanged_prices?: number;
          unmapped_bookmakers?: number;
          unmapped_markets?: number;
          unresolved_events?: number;
        };
        Update: {
          bookmakers_received?: number;
          completed_at?: string | null;
          created_at?: string;
          current_prices_created?: number;
          current_prices_updated?: number;
          error_summary?: string | null;
          events_received?: number;
          failures?: number;
          fixtures_requested?: number;
          id?: string;
          invalid_prices?: number;
          job_type?: string;
          markets_processed?: number;
          provider?: string;
          requests_used?: number;
          selections_processed?: number;
          snapshots_created?: number;
          started_at?: string;
          status?: string;
          unchanged_prices?: number;
          unmapped_bookmakers?: number;
          unmapped_markets?: number;
          unresolved_events?: number;
        };
        Relationships: [];
      };
      odds_provider_health: {
        Row: {
          consecutive_failures: number;
          created_at: string;
          id: string;
          last_error: string | null;
          last_failure_at: string | null;
          last_successful_sync_at: string | null;
          provider: string;
          requests_remaining: number | null;
          stale_odds_count: number;
          status: string;
          unmapped_bookmaker_count: number;
          unmapped_market_count: number;
          unresolved_event_count: number;
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
          requests_remaining?: number | null;
          stale_odds_count?: number;
          status?: string;
          unmapped_bookmaker_count?: number;
          unmapped_market_count?: number;
          unresolved_event_count?: number;
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
          requests_remaining?: number | null;
          stale_odds_count?: number;
          status?: string;
          unmapped_bookmaker_count?: number;
          unmapped_market_count?: number;
          unresolved_event_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      odds_snapshots: {
        Row: {
          bookmaker_id: string;
          created_at: string;
          current_odds_id: string;
          decimal_odds: number;
          fetched_at: string;
          fixture_id: string;
          id: string;
          line: number | null;
          market_id: string;
          market_status: string;
          observation_hash: string;
          participant: string | null;
          provider: string;
          provider_event_id: string;
          provider_market_id: string;
          provider_selection_key: string;
          selection_key: string;
          source_updated_at: string;
        };
        Insert: {
          bookmaker_id: string;
          created_at?: string;
          current_odds_id: string;
          decimal_odds: number;
          fetched_at: string;
          fixture_id: string;
          id?: string;
          line?: number | null;
          market_id: string;
          market_status: string;
          observation_hash: string;
          participant?: string | null;
          provider: string;
          provider_event_id: string;
          provider_market_id: string;
          provider_selection_key: string;
          selection_key: string;
          source_updated_at: string;
        };
        Update: {
          bookmaker_id?: string;
          created_at?: string;
          current_odds_id?: string;
          decimal_odds?: number;
          fetched_at?: string;
          fixture_id?: string;
          id?: string;
          line?: number | null;
          market_id?: string;
          market_status?: string;
          observation_hash?: string;
          participant?: string | null;
          provider?: string;
          provider_event_id?: string;
          provider_market_id?: string;
          provider_selection_key?: string;
          selection_key?: string;
          source_updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "odds_snapshots_bookmaker_id_fkey";
            columns: ["bookmaker_id"];
            isOneToOne: false;
            referencedRelation: "bookmakers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "odds_snapshots_bookmaker_id_fkey";
            columns: ["bookmaker_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["bookmaker_id"];
          },
          {
            foreignKeyName: "odds_snapshots_current_odds_id_fkey";
            columns: ["current_odds_id"];
            isOneToOne: false;
            referencedRelation: "current_odds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "odds_snapshots_current_odds_id_fkey";
            columns: ["current_odds_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "odds_snapshots_fixture_id_fkey";
            columns: ["fixture_id"];
            isOneToOne: false;
            referencedRelation: "fixtures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "odds_snapshots_fixture_id_fkey";
            columns: ["fixture_id"];
            isOneToOne: false;
            referencedRelation: "v_public_fixtures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "odds_snapshots_market_id_fkey";
            columns: ["market_id"];
            isOneToOne: false;
            referencedRelation: "canonical_markets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "odds_snapshots_market_id_fkey";
            columns: ["market_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["market_id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          onboarding_completed_at: string | null;
          onboarding_step: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          onboarding_completed_at?: string | null;
          onboarding_step?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          onboarding_completed_at?: string | null;
          onboarding_step?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      provider_bookmaker_mappings: {
        Row: {
          bookmaker_id: string;
          created_at: string;
          id: string;
          last_seen_at: string;
          provider: string;
          provider_bookmaker_id: string;
          provider_bookmaker_name: string;
          updated_at: string;
          verified: boolean;
        };
        Insert: {
          bookmaker_id: string;
          created_at?: string;
          id?: string;
          last_seen_at?: string;
          provider: string;
          provider_bookmaker_id: string;
          provider_bookmaker_name: string;
          updated_at?: string;
          verified?: boolean;
        };
        Update: {
          bookmaker_id?: string;
          created_at?: string;
          id?: string;
          last_seen_at?: string;
          provider?: string;
          provider_bookmaker_id?: string;
          provider_bookmaker_name?: string;
          updated_at?: string;
          verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "provider_bookmaker_mappings_bookmaker_id_fkey";
            columns: ["bookmaker_id"];
            isOneToOne: false;
            referencedRelation: "bookmakers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "provider_bookmaker_mappings_bookmaker_id_fkey";
            columns: ["bookmaker_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["bookmaker_id"];
          },
        ];
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
      provider_market_mappings: {
        Row: {
          created_at: string;
          id: string;
          market_id: string;
          market_scope: string;
          participant: string | null;
          provider: string;
          provider_market_id: string;
          provider_market_name: string;
          updated_at: string;
          verified: boolean;
        };
        Insert: {
          created_at?: string;
          id?: string;
          market_id: string;
          market_scope?: string;
          participant?: string | null;
          provider: string;
          provider_market_id: string;
          provider_market_name: string;
          updated_at?: string;
          verified?: boolean;
        };
        Update: {
          created_at?: string;
          id?: string;
          market_id?: string;
          market_scope?: string;
          participant?: string | null;
          provider?: string;
          provider_market_id?: string;
          provider_market_name?: string;
          updated_at?: string;
          verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "provider_market_mappings_market_id_fkey";
            columns: ["market_id"];
            isOneToOne: false;
            referencedRelation: "canonical_markets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "provider_market_mappings_market_id_fkey";
            columns: ["market_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["market_id"];
          },
        ];
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
      provider_selection_mappings: {
        Row: {
          canonical_selection_key: string;
          created_at: string;
          id: string;
          provider: string;
          provider_market_id: string;
          provider_selection_key: string;
          updated_at: string;
          verified: boolean;
        };
        Insert: {
          canonical_selection_key: string;
          created_at?: string;
          id?: string;
          provider: string;
          provider_market_id: string;
          provider_selection_key: string;
          updated_at?: string;
          verified?: boolean;
        };
        Update: {
          canonical_selection_key?: string;
          created_at?: string;
          id?: string;
          provider?: string;
          provider_market_id?: string;
          provider_selection_key?: string;
          updated_at?: string;
          verified?: boolean;
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
        Relationships: [
          {
            foreignKeyName: "seasons_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "competitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "seasons_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "v_current_odds";
            referencedColumns: ["competition_id"];
          },
          {
            foreignKeyName: "seasons_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "v_public_fixtures";
            referencedColumns: ["competition_id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "teams_area_id_fkey";
            columns: ["area_id"];
            isOneToOne: false;
            referencedRelation: "areas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teams_sport_id_fkey";
            columns: ["sport_id"];
            isOneToOne: false;
            referencedRelation: "sports";
            referencedColumns: ["id"];
          },
        ];
      };
      unresolved_odds_events: {
        Row: {
          canonical_fixture_id: string | null;
          created_at: string;
          first_seen_at: string;
          id: string;
          last_seen_at: string;
          occurrence_count: number;
          provider: string;
          provider_event_id: string;
          reason: string;
          resolved_at: string | null;
          updated_at: string;
        };
        Insert: {
          canonical_fixture_id?: string | null;
          created_at?: string;
          first_seen_at?: string;
          id?: string;
          last_seen_at?: string;
          occurrence_count?: number;
          provider: string;
          provider_event_id: string;
          reason: string;
          resolved_at?: string | null;
          updated_at?: string;
        };
        Update: {
          canonical_fixture_id?: string | null;
          created_at?: string;
          first_seen_at?: string;
          id?: string;
          last_seen_at?: string;
          occurrence_count?: number;
          provider?: string;
          provider_event_id?: string;
          reason?: string;
          resolved_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "unresolved_odds_events_canonical_fixture_id_fkey";
            columns: ["canonical_fixture_id"];
            isOneToOne: false;
            referencedRelation: "fixtures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "unresolved_odds_events_canonical_fixture_id_fkey";
            columns: ["canonical_fixture_id"];
            isOneToOne: false;
            referencedRelation: "v_public_fixtures";
            referencedColumns: ["id"];
          },
        ];
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
    };
    Views: {
      v_current_odds: {
        Row: {
          away_team_id: string | null;
          away_team_name: string | null;
          bookmaker_id: string | null;
          bookmaker_key: string | null;
          bookmaker_name: string | null;
          competition_id: string | null;
          competition_name: string | null;
          decimal_odds: number | null;
          fetched_at: string | null;
          first_observed_at: string | null;
          fixture_id: string | null;
          fixture_status: Database["public"]["Enums"]["fixture_status"] | null;
          home_team_id: string | null;
          home_team_name: string | null;
          id: string | null;
          kickoff_at: string | null;
          last_observed_at: string | null;
          line: number | null;
          market_id: string | null;
          market_key: string | null;
          market_name: string | null;
          market_status: string | null;
          participant: string | null;
          provider: string | null;
          selection_key: string | null;
          source_updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "current_odds_fixture_id_fkey";
            columns: ["fixture_id"];
            isOneToOne: false;
            referencedRelation: "fixtures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "current_odds_fixture_id_fkey";
            columns: ["fixture_id"];
            isOneToOne: false;
            referencedRelation: "v_public_fixtures";
            referencedColumns: ["id"];
          },
        ];
      };
      v_public_fixtures: {
        Row: {
          away_score: number | null;
          away_team_id: string | null;
          away_team_logo_url: string | null;
          away_team_name: string | null;
          away_team_short_name: string | null;
          competition_id: string | null;
          competition_key: string | null;
          competition_logo_url: string | null;
          competition_name: string | null;
          halftime_away_score: number | null;
          halftime_home_score: number | null;
          home_score: number | null;
          home_team_id: string | null;
          home_team_logo_url: string | null;
          home_team_name: string | null;
          home_team_short_name: string | null;
          id: string | null;
          kickoff_at: string | null;
          last_synced_at: string | null;
          matchday: number | null;
          round: string | null;
          stage: string | null;
          status: Database["public"]["Enums"]["fixture_status"] | null;
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
      ingest_odds_batch: {
        Args: { p_observations: Json };
        Returns: {
          created_count: number;
          ignored_older_count: number;
          snapshot_count: number;
          unchanged_count: number;
          updated_count: number;
        }[];
      };
      ingest_odds_observation: {
        Args: {
          p_bookmaker_id: string;
          p_decimal_odds: number;
          p_fetched_at: string;
          p_fixture_id: string;
          p_line: number;
          p_market_id: string;
          p_market_status: string;
          p_participant: string;
          p_provider: string;
          p_provider_event_id: string;
          p_provider_market_id: string;
          p_provider_selection_key: string;
          p_selection_key: string;
          p_source_updated_at: string;
        };
        Returns: {
          action: string;
          current_odds_id: string;
          snapshot_created: boolean;
        }[];
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
    Enums: {
      fixture_status:
        | "scheduled"
        | "delayed"
        | "postponed"
        | "cancelled"
        | "suspended"
        | "live"
        | "halftime"
        | "extra_time"
        | "penalties"
        | "finished"
        | "abandoned"
        | "awarded"
        | "unknown";
    };
    CompositeTypes: Record<never, never>;
  };
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- generated empty composite type union
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      fixture_status: [
        "scheduled",
        "delayed",
        "postponed",
        "cancelled",
        "suspended",
        "live",
        "halftime",
        "extra_time",
        "penalties",
        "finished",
        "abandoned",
        "awarded",
        "unknown",
      ],
    },
  },
} as const;
