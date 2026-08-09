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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          diff: Json | null
          id: number
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          id?: number
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          id?: number
          record_id?: string | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clusters: {
        Row: {
          body: string | null
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          deleted_at: string | null
          facade_styles: string[] | null
          handover_actual: string | null
          handover_target: string | null
          id: string
          launch_date: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          notes: string | null
          payment_plan: string | null
          phase: number | null
          plex_config: string | null
          positioning: string | null
          price_from_aed: number | null
          product_type: string | null
          single_row: boolean | null
          slug: string
          sort_order: number
          source_id: string | null
          state: Database["public"]["Enums"]["publish_state"]
          summary: string | null
          unit_count: number | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          body?: string | null
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          deleted_at?: string | null
          facade_styles?: string[] | null
          handover_actual?: string | null
          handover_target?: string | null
          id?: string
          launch_date?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          notes?: string | null
          payment_plan?: string | null
          phase?: number | null
          plex_config?: string | null
          positioning?: string | null
          price_from_aed?: number | null
          product_type?: string | null
          single_row?: boolean | null
          slug: string
          sort_order?: number
          source_id?: string | null
          state?: Database["public"]["Enums"]["publish_state"]
          summary?: string | null
          unit_count?: number | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          body?: string | null
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          deleted_at?: string | null
          facade_styles?: string[] | null
          handover_actual?: string | null
          handover_target?: string | null
          id?: string
          launch_date?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          notes?: string | null
          payment_plan?: string | null
          phase?: number | null
          plex_config?: string | null
          positioning?: string | null
          price_from_aed?: number | null
          product_type?: string | null
          single_row?: boolean | null
          slug?: string
          sort_order?: number
          source_id?: string | null
          state?: Database["public"]["Enums"]["publish_state"]
          summary?: string | null
          unit_count?: number | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clusters_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          created_at: string
          developer: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          state: Database["public"]["Enums"]["publish_state"]
          summary: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          developer?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          state?: Database["public"]["Enums"]["publish_state"]
          summary?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          developer?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          state?: Database["public"]["Enums"]["publish_state"]
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      comparisons: {
        Row: {
          community_id: string
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          dimension: string
          honest_read: string | null
          id: string
          other_advantage: string | null
          sort_order: number
          source_id: string | null
          updated_at: string
          valley_advantage: string | null
        }
        Insert: {
          community_id: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          dimension: string
          honest_read?: string | null
          id?: string
          other_advantage?: string | null
          sort_order?: number
          source_id?: string | null
          updated_at?: string
          valley_advantage?: string | null
        }
        Update: {
          community_id?: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          dimension?: string
          honest_read?: string | null
          id?: string
          other_advantage?: string | null
          sort_order?: number
          source_id?: string | null
          updated_at?: string
          valley_advantage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comparisons_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparisons_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      facade_style_descriptions: {
        Row: {
          cluster_id: string
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          description: string | null
          id: string
          sort_order: number
          source_id: string | null
          style_name: string
          updated_at: string
        }
        Insert: {
          cluster_id: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          source_id?: string | null
          style_name: string
          updated_at?: string
        }
        Update: {
          cluster_id?: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          source_id?: string | null
          style_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "facade_style_descriptions_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facade_style_descriptions_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          caption: string | null
          captured_on: string | null
          created_at: string
          credit: string | null
          height: number | null
          id: string
          kind: string
          lat: number | null
          lng: number | null
          storage_path: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          captured_on?: string | null
          created_at?: string
          credit?: string | null
          height?: number | null
          id?: string
          kind?: string
          lat?: number | null
          lng?: number | null
          storage_path: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          captured_on?: string | null
          created_at?: string
          credit?: string | null
          height?: number | null
          id?: string
          kind?: string
          lat?: number | null
          lng?: number | null
          storage_path?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_links: {
        Row: {
          is_primary: boolean
          media_id: string
          sort_order: number
          subject_id: string
          subject_type: string
        }
        Insert: {
          is_primary?: boolean
          media_id: string
          sort_order?: number
          subject_id: string
          subject_type: string
        }
        Update: {
          is_primary?: boolean
          media_id?: string
          sort_order?: number
          subject_id?: string
          subject_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_links_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          address: string | null
          category: string
          cluster_id: string | null
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          deleted_at: string | null
          drive_minutes: number | null
          drive_verified: boolean
          google_place_id: string | null
          hours: Json | null
          id: string
          in_community: boolean
          lat: number | null
          lng: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          notes: string | null
          operator: string | null
          parent_place_id: string | null
          phone: string | null
          slug: string
          sort_order: number
          source_id: string | null
          state: Database["public"]["Enums"]["publish_state"]
          subcategory: string | null
          summary: string | null
          updated_at: string
          verified_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          category: string
          cluster_id?: string | null
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          deleted_at?: string | null
          drive_minutes?: number | null
          drive_verified?: boolean
          google_place_id?: string | null
          hours?: Json | null
          id?: string
          in_community?: boolean
          lat?: number | null
          lng?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          notes?: string | null
          operator?: string | null
          parent_place_id?: string | null
          phone?: string | null
          slug: string
          sort_order?: number
          source_id?: string | null
          state?: Database["public"]["Enums"]["publish_state"]
          subcategory?: string | null
          summary?: string | null
          updated_at?: string
          verified_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          cluster_id?: string | null
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          deleted_at?: string | null
          drive_minutes?: number | null
          drive_verified?: boolean
          google_place_id?: string | null
          hours?: Json | null
          id?: string
          in_community?: boolean
          lat?: number | null
          lng?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          notes?: string | null
          operator?: string | null
          parent_place_id?: string | null
          phone?: string | null
          slug?: string
          sort_order?: number
          source_id?: string | null
          state?: Database["public"]["Enums"]["publish_state"]
          subcategory?: string | null
          summary?: string | null
          updated_at?: string
          verified_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "places_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "places_parent_place_id_fkey"
            columns: ["parent_place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "places_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          body: string | null
          cluster_id: string | null
          created_at: string
          deleted_at: string | null
          excerpt: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          state: Database["public"]["Enums"]["publish_state"]
          title: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          cluster_id?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          state?: Database["public"]["Enums"]["publish_state"]
          title: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          cluster_id?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          state?: Database["public"]["Enums"]["publish_state"]
          title?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          unit_id: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          unit_id?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          answer_long: string | null
          answer_short: string | null
          ask_count: number
          audience: string
          cluster_id: string | null
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          deleted_at: string | null
          id: string
          is_generated: boolean
          meta_description: string | null
          meta_title: string | null
          place_id: string | null
          question: string
          slug: string
          sort_order: number
          source_id: string | null
          state: Database["public"]["Enums"]["publish_state"]
          topic: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          answer_long?: string | null
          answer_short?: string | null
          ask_count?: number
          audience: string
          cluster_id?: string | null
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_generated?: boolean
          meta_description?: string | null
          meta_title?: string | null
          place_id?: string | null
          question: string
          slug: string
          sort_order?: number
          source_id?: string | null
          state?: Database["public"]["Enums"]["publish_state"]
          topic: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          answer_long?: string | null
          answer_short?: string | null
          ask_count?: number
          audience?: string
          cluster_id?: string | null
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_generated?: boolean
          meta_description?: string | null
          meta_title?: string | null
          place_id?: string | null
          question?: string
          slug?: string
          sort_order?: number
          source_id?: string | null
          state?: Database["public"]["Enums"]["publish_state"]
          topic?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      redirects: {
        Row: {
          created_at: string
          from_path: string
          id: string
          reason: string | null
          status_code: number
          to_path: string
        }
        Insert: {
          created_at?: string
          from_path: string
          id?: string
          reason?: string | null
          status_code?: number
          to_path: string
        }
        Update: {
          created_at?: string
          from_path?: string
          id?: string
          reason?: string | null
          status_code?: number
          to_path?: string
        }
        Relationships: []
      }
      sources: {
        Row: {
          created_at: string
          id: string
          kind: string
          label: string
          notes: string | null
          retrieved_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          label: string
          notes?: string | null
          retrieved_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          label?: string
          notes?: string | null
          retrieved_at?: string
          url?: string | null
        }
        Relationships: []
      }
      status_log: {
        Row: {
          amenity_key: string | null
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          id: string
          note: string | null
          observed_on: string
          source_id: string | null
          status: string
          subject_id: string | null
          subject_type: string
        }
        Insert: {
          amenity_key?: string | null
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          id?: string
          note?: string | null
          observed_on?: string
          source_id?: string | null
          status: string
          subject_id?: string | null
          subject_type: string
        }
        Update: {
          amenity_key?: string | null
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          id?: string
          note?: string | null
          observed_on?: string
          source_id?: string | null
          status?: string
          subject_id?: string | null
          subject_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_log_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_types: {
        Row: {
          balcony_area: number | null
          bedrooms: number
          bua_max: number | null
          bua_min: number | null
          cluster_id: string
          confidence: Database["public"]["Enums"]["confidence_level"]
          corner_unit: boolean | null
          created_at: string
          garage_area: number | null
          ground_floor_bedroom: boolean | null
          id: string
          label: string | null
          layout: string | null
          maids_room: boolean | null
          notes: string | null
          plot_max: number | null
          plot_min: number | null
          private_pool: boolean | null
          roof_terrace_area: number | null
          sort_order: number
          source_id: string | null
          suite_area: number | null
          unit_count: number | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          balcony_area?: number | null
          bedrooms: number
          bua_max?: number | null
          bua_min?: number | null
          cluster_id: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          corner_unit?: boolean | null
          created_at?: string
          garage_area?: number | null
          ground_floor_bedroom?: boolean | null
          id?: string
          label?: string | null
          layout?: string | null
          maids_room?: boolean | null
          notes?: string | null
          plot_max?: number | null
          plot_min?: number | null
          private_pool?: boolean | null
          roof_terrace_area?: number | null
          sort_order?: number
          source_id?: string | null
          suite_area?: number | null
          unit_count?: number | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          balcony_area?: number | null
          bedrooms?: number
          bua_max?: number | null
          bua_min?: number | null
          cluster_id?: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          corner_unit?: boolean | null
          created_at?: string
          garage_area?: number | null
          ground_floor_bedroom?: boolean | null
          id?: string
          label?: string | null
          layout?: string | null
          maids_room?: boolean | null
          notes?: string | null
          plot_max?: number | null
          plot_min?: number | null
          private_pool?: boolean | null
          roof_terrace_area?: number | null
          sort_order?: number
          source_id?: string | null
          suite_area?: number | null
          unit_count?: number | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unit_types_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unit_types_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          cluster_id: string
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          facade_style: string | null
          id: string
          lat: number | null
          lng: number | null
          notes: string | null
          plot_number: number | null
          sort_order: number
          source_id: string | null
          unit_number: string
          unit_type_id: string
          updated_at: string
        }
        Insert: {
          cluster_id: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          facade_style?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          plot_number?: number | null
          sort_order?: number
          source_id?: string | null
          unit_number: string
          unit_type_id: string
          updated_at?: string
        }
        Update: {
          cluster_id?: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          facade_style?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          plot_number?: number | null
          sort_order?: number
          source_id?: string | null
          unit_number?: string
          unit_type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_unit_type_id_fkey"
            columns: ["unit_type_id"]
            isOneToOne: false
            referencedRelation: "unit_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      current_status: {
        Row: {
          amenity_key: string | null
          confidence: Database["public"]["Enums"]["confidence_level"] | null
          note: string | null
          observed_on: string | null
          status: string | null
          subject_id: string | null
          subject_type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      app_role_of: {
        Args: { uid?: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      can_edit: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "editor" | "viewer"
      confidence_level: "official" | "corroborated" | "unverified"
      publish_state: "draft" | "published" | "archived"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["owner", "editor", "viewer"],
      confidence_level: ["official", "corroborated", "unverified"],
      publish_state: ["draft", "published", "archived"],
    },
  },
} as const
