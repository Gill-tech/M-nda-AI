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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      credit_scores: {
        Row: {
          climate_resilience_score: number | null
          created_at: string
          farm_assets_score: number | null
          farm_efficiency_score: number | null
          id: string
          last_calculated: string
          payment_history_score: number | null
          predicted_yield_score: number | null
          risk_level: string | null
          score: number
          user_id: string
        }
        Insert: {
          climate_resilience_score?: number | null
          created_at?: string
          farm_assets_score?: number | null
          farm_efficiency_score?: number | null
          id?: string
          last_calculated?: string
          payment_history_score?: number | null
          predicted_yield_score?: number | null
          risk_level?: string | null
          score: number
          user_id: string
        }
        Update: {
          climate_resilience_score?: number | null
          created_at?: string
          farm_assets_score?: number | null
          farm_efficiency_score?: number | null
          id?: string
          last_calculated?: string
          payment_history_score?: number | null
          predicted_yield_score?: number | null
          risk_level?: string | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      crop_yield_data: {
        Row: {
          created_at: string
          crop_type: string
          humidity: number | null
          id: string
          nitrogen_level: number | null
          phosphorus_level: number | null
          potassium_level: number | null
          rainfall: number | null
          region: string | null
          soil_ph: number | null
          soil_type: string | null
          temperature: number | null
          yield_per_hectare: number | null
        }
        Insert: {
          created_at?: string
          crop_type: string
          humidity?: number | null
          id?: string
          nitrogen_level?: number | null
          phosphorus_level?: number | null
          potassium_level?: number | null
          rainfall?: number | null
          region?: string | null
          soil_ph?: number | null
          soil_type?: string | null
          temperature?: number | null
          yield_per_hectare?: number | null
        }
        Update: {
          created_at?: string
          crop_type?: string
          humidity?: number | null
          id?: string
          nitrogen_level?: number | null
          phosphorus_level?: number | null
          potassium_level?: number | null
          rainfall?: number | null
          region?: string | null
          soil_ph?: number | null
          soil_type?: string | null
          temperature?: number | null
          yield_per_hectare?: number | null
        }
        Relationships: []
      }
      crops: {
        Row: {
          area_hectares: number | null
          created_at: string
          expected_harvest_date: string | null
          farm_id: string
          health_score: number | null
          id: string
          name: string
          planted_date: string | null
          status: string | null
          updated_at: string
          variety: string | null
        }
        Insert: {
          area_hectares?: number | null
          created_at?: string
          expected_harvest_date?: string | null
          farm_id: string
          health_score?: number | null
          id?: string
          name: string
          planted_date?: string | null
          status?: string | null
          updated_at?: string
          variety?: string | null
        }
        Update: {
          area_hectares?: number | null
          created_at?: string
          expected_harvest_date?: string | null
          farm_id?: string
          health_score?: number | null
          id?: string
          name?: string
          planted_date?: string | null
          status?: string | null
          updated_at?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crops_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          created_at: string
          farm_type: string | null
          id: string
          irrigation_type: string | null
          is_registered: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
          region: string | null
          registered_at: string | null
          serial_number: string
          size_hectares: number | null
          soil_type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          farm_type?: string | null
          id?: string
          irrigation_type?: string | null
          is_registered?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
          region?: string | null
          registered_at?: string | null
          serial_number: string
          size_hectares?: number | null
          soil_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          farm_type?: string | null
          id?: string
          irrigation_type?: string | null
          is_registered?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
          region?: string | null
          registered_at?: string | null
          serial_number?: string
          size_hectares?: number | null
          soil_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fertilizer_recommendations: {
        Row: {
          application_rate: string | null
          created_at: string
          crop_type: string
          id: string
          moisture_level: number | null
          nitrogen_level: number | null
          notes: string | null
          phosphorus_level: number | null
          potassium_level: number | null
          recommended_fertilizer: string
          soil_ph: number | null
          soil_type: string
        }
        Insert: {
          application_rate?: string | null
          created_at?: string
          crop_type: string
          id?: string
          moisture_level?: number | null
          nitrogen_level?: number | null
          notes?: string | null
          phosphorus_level?: number | null
          potassium_level?: number | null
          recommended_fertilizer: string
          soil_ph?: number | null
          soil_type: string
        }
        Update: {
          application_rate?: string | null
          created_at?: string
          crop_type?: string
          id?: string
          moisture_level?: number | null
          nitrogen_level?: number | null
          notes?: string | null
          phosphorus_level?: number | null
          potassium_level?: number | null
          recommended_fertilizer?: string
          soil_ph?: number | null
          soil_type?: string
        }
        Relationships: []
      }
      insurance_policies: {
        Row: {
          coverage_amount: number
          created_at: string
          end_date: string | null
          id: string
          policy_type: string
          premium: number
          start_date: string
          status: string
          trigger_condition: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          coverage_amount: number
          created_at?: string
          end_date?: string | null
          id?: string
          policy_type: string
          premium: number
          start_date?: string
          status?: string
          trigger_condition?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          coverage_amount?: number
          created_at?: string
          end_date?: string | null
          id?: string
          policy_type?: string
          premium?: number
          start_date?: string
          status?: string
          trigger_condition?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      insurance_providers: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          min_credit_score: number
          name: string
          payout_triggers: string[] | null
          policy_types: string[] | null
          premium_range_max: number | null
          premium_range_min: number | null
          risks_covered: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          min_credit_score: number
          name: string
          payout_triggers?: string[] | null
          policy_types?: string[] | null
          premium_range_max?: number | null
          premium_range_min?: number | null
          risks_covered?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          min_credit_score?: number
          name?: string
          payout_triggers?: string[] | null
          policy_types?: string[] | null
          premium_range_max?: number | null
          premium_range_min?: number | null
          risks_covered?: string[] | null
        }
        Relationships: []
      }
      livestock: {
        Row: {
          animal_type: string
          breed: string | null
          count: number | null
          created_at: string
          farm_id: string
          health_status: string | null
          id: string
          last_vaccination: string | null
          notes: string | null
          purpose: string | null
          updated_at: string
        }
        Insert: {
          animal_type: string
          breed?: string | null
          count?: number | null
          created_at?: string
          farm_id: string
          health_status?: string | null
          id?: string
          last_vaccination?: string | null
          notes?: string | null
          purpose?: string | null
          updated_at?: string
        }
        Update: {
          animal_type?: string
          breed?: string | null
          count?: number | null
          created_at?: string
          farm_id?: string
          health_status?: string | null
          id?: string
          last_vaccination?: string | null
          notes?: string | null
          purpose?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "livestock_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          amount: number
          application_date: string
          approved_date: string | null
          created_at: string
          due_date: string | null
          id: string
          interest_rate: number
          loan_type: string
          status: string
          term_months: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          application_date?: string
          approved_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          interest_rate: number
          loan_type: string
          status?: string
          term_months: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          application_date?: string
          approved_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          interest_rate?: number
          loan_type?: string
          status?: string
          term_months?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          created_at: string
          crop_type: string
          demand_level: string | null
          id: string
          last_updated: string
          market_id: string | null
          price_per_kg: number
          unit: string | null
        }
        Insert: {
          created_at?: string
          crop_type: string
          demand_level?: string | null
          id?: string
          last_updated?: string
          market_id?: string | null
          price_per_kg: number
          unit?: string | null
        }
        Update: {
          created_at?: string
          crop_type?: string
          demand_level?: string | null
          id?: string
          last_updated?: string
          market_id?: string | null
          price_per_kg?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_prices_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          created_at: string
          distance_km: number | null
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          market_type: string | null
          name: string
          operating_days: string[] | null
          road_condition: string | null
        }
        Insert: {
          created_at?: string
          distance_km?: number | null
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          market_type?: string | null
          name: string
          operating_days?: string[] | null
          road_condition?: string | null
        }
        Update: {
          created_at?: string
          distance_km?: number | null
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          market_type?: string | null
          name?: string
          operating_days?: string[] | null
          road_condition?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      qualified_lenders: {
        Row: {
          created_at: string
          id: string
          interest_rate_max: number
          interest_rate_min: number
          logo_url: string | null
          max_loan_amount: number
          max_term_months: number
          min_credit_score: number
          min_loan_amount: number
          name: string
          requirements: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          interest_rate_max: number
          interest_rate_min: number
          logo_url?: string | null
          max_loan_amount: number
          max_term_months: number
          min_credit_score: number
          min_loan_amount: number
          name: string
          requirements?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          interest_rate_max?: number
          interest_rate_min?: number
          logo_url?: string | null
          max_loan_amount?: number
          max_term_months?: number
          min_credit_score?: number
          min_loan_amount?: number
          name?: string
          requirements?: string[] | null
        }
        Relationships: []
      }
      soil_readings: {
        Row: {
          created_at: string
          farm_id: string | null
          humidity: number | null
          id: string
          location_lat: number | null
          location_lng: number | null
          moisture_level: number | null
          nitrogen_level: number | null
          phosphorus_level: number | null
          potassium_level: number | null
          reading_date: string
          section_name: string | null
          soil_ph: number | null
          temperature: number | null
          user_id: string
          wind_speed: number | null
        }
        Insert: {
          created_at?: string
          farm_id?: string | null
          humidity?: number | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          moisture_level?: number | null
          nitrogen_level?: number | null
          phosphorus_level?: number | null
          potassium_level?: number | null
          reading_date?: string
          section_name?: string | null
          soil_ph?: number | null
          temperature?: number | null
          user_id: string
          wind_speed?: number | null
        }
        Update: {
          created_at?: string
          farm_id?: string | null
          humidity?: number | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          moisture_level?: number | null
          nitrogen_level?: number | null
          phosphorus_level?: number | null
          potassium_level?: number | null
          reading_date?: string
          section_name?: string | null
          soil_ph?: number | null
          temperature?: number | null
          user_id?: string
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "soil_readings_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_farm_by_serial: {
        Args: { p_serial_number: string; p_user_id: string }
        Returns: {
          created_at: string
          farm_type: string | null
          id: string
          irrigation_type: string | null
          is_registered: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
          region: string | null
          registered_at: string | null
          serial_number: string
          size_hectares: number | null
          soil_type: string | null
          updated_at: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "farms"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
