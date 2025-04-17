export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          client_name: string
          client_phone: string | null
          created_at: string | null
          end_time: string
          id: string
          notes: string | null
          salon_id: string
          service: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_name: string
          client_phone?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          notes?: string | null
          salon_id: string
          service?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_name?: string
          client_phone?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          salon_id?: string
          service?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string
          fiscal_code: string | null
          gender: string | null
          id: string
          is_private: boolean | null
          last_name: string
          loyalty_code: string | null
          notes: string | null
          pec_email: string | null
          phone: string | null
          salon_id: string
          sdi_code: string | null
          updated_at: string | null
          vat_number: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name: string
          fiscal_code?: string | null
          gender?: string | null
          id?: string
          is_private?: boolean | null
          last_name: string
          loyalty_code?: string | null
          notes?: string | null
          pec_email?: string | null
          phone?: string | null
          salon_id: string
          sdi_code?: string | null
          updated_at?: string | null
          vat_number?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string
          fiscal_code?: string | null
          gender?: string | null
          id?: string
          is_private?: boolean | null
          last_name?: string
          loyalty_code?: string | null
          notes?: string | null
          pec_email?: string | null
          phone?: string | null
          salon_id?: string
          sdi_code?: string | null
          updated_at?: string | null
          vat_number?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string | null
          description: string | null
          frequency: string
          id: string
          name: string
          salon_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          frequency: string
          id?: string
          name: string
          salon_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          frequency?: string
          id?: string
          name?: string
          salon_id?: string
        }
        Relationships: []
      }
      product_brands: {
        Row: {
          created_at: string | null
          id: string
          name: string
          salon_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          salon_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          salon_id?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          salon_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          salon_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          salon_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          barcode: string | null
          brand: string | null
          category: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          format: string | null
          id: string
          low_stock_threshold: number | null
          name: string
          price: number
          salon_id: string
          size: string | null
          sku: string | null
          stock_quantity: number | null
          updated_at: string | null
          volume: string | null
          weight: number | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          format?: string | null
          id?: string
          low_stock_threshold?: number | null
          name: string
          price: number
          salon_id: string
          size?: string | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          volume?: string | null
          weight?: number | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          format?: string | null
          id?: string
          low_stock_threshold?: number | null
          name?: string
          price?: number
          salon_id?: string
          size?: string | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          volume?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      project_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          salon_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          salon_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          salon_id?: string
        }
        Relationships: []
      }
      project_objectives: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string
          id: string
          is_completed: boolean | null
          project_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_completed?: boolean | null
          project_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_completed?: boolean | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_objectives_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category_id: string | null
          client_id: string | null
          created_at: string | null
          custom_fields: Json | null
          description: string | null
          end_date: string | null
          feedback: string | null
          id: string
          progress: number | null
          salon_id: string
          staff_ids: string[] | null
          start_date: string | null
          status: string | null
          subcategory_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          client_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          end_date?: string | null
          feedback?: string | null
          id?: string
          progress?: number | null
          salon_id: string
          staff_ids?: string[] | null
          start_date?: string | null
          status?: string | null
          subcategory_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          client_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          end_date?: string | null
          feedback?: string | null
          id?: string
          progress?: number | null
          salon_id?: string
          staff_ids?: string[] | null
          start_date?: string | null
          status?: string | null
          subcategory_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_profiles: {
        Row: {
          address: string | null
          business_name: string
          codice_fiscale: string | null
          created_at: string | null
          email: string | null
          iban: string | null
          id: string
          phone: string | null
          piva: string | null
          ragione_sociale: string | null
          salon_id: string
          sede_legale: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          codice_fiscale?: string | null
          created_at?: string | null
          email?: string | null
          iban?: string | null
          id?: string
          phone?: string | null
          piva?: string | null
          ragione_sociale?: string | null
          salon_id: string
          sede_legale?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          codice_fiscale?: string | null
          created_at?: string | null
          email?: string | null
          iban?: string | null
          id?: string
          phone?: string | null
          piva?: string | null
          ragione_sociale?: string | null
          salon_id?: string
          sede_legale?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          salon_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          salon_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          salon_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          assigned_service_ids: string[] | null
          assigned_staff_ids: string[] | null
          category: string | null
          color: string | null
          created_at: string | null
          description: string | null
          duration: number
          id: string
          name: string
          price: number
          salon_id: string
          tempo_di_posa: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_service_ids?: string[] | null
          assigned_staff_ids?: string[] | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          name: string
          price: number
          salon_id: string
          tempo_di_posa?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_service_ids?: string[] | null
          assigned_staff_ids?: string[] | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number
          salon_id?: string
          tempo_di_posa?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          additional_phone: string | null
          assigned_service_ids: string[] | null
          birth_date: string | null
          color: string | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          permissions: string[] | null
          phone: string | null
          position: string | null
          salon_id: string
          show_in_calendar: boolean | null
          updated_at: string | null
          work_schedule: Json | null
        }
        Insert: {
          additional_phone?: string | null
          assigned_service_ids?: string[] | null
          birth_date?: string | null
          color?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          permissions?: string[] | null
          phone?: string | null
          position?: string | null
          salon_id: string
          show_in_calendar?: boolean | null
          updated_at?: string | null
          work_schedule?: Json | null
        }
        Update: {
          additional_phone?: string | null
          assigned_service_ids?: string[] | null
          birth_date?: string | null
          color?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          permissions?: string[] | null
          phone?: string | null
          position?: string | null
          salon_id?: string
          show_in_calendar?: boolean | null
          updated_at?: string | null
          work_schedule?: Json | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancellable_immediately: boolean | null
          client_id: string | null
          created_at: string | null
          discount: number | null
          end_date: string | null
          entries_per_month: number | null
          geolocation_enabled: boolean | null
          geolocation_radius: number | null
          id: string
          include_all_services: boolean | null
          max_duration: number | null
          min_duration: number | null
          name: string
          payment_method: string | null
          price: number
          recurrence_type: string
          salon_id: string
          sell_online: boolean | null
          service_ids: string[] | null
          start_date: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          cancellable_immediately?: boolean | null
          client_id?: string | null
          created_at?: string | null
          discount?: number | null
          end_date?: string | null
          entries_per_month?: number | null
          geolocation_enabled?: boolean | null
          geolocation_radius?: number | null
          id?: string
          include_all_services?: boolean | null
          max_duration?: number | null
          min_duration?: number | null
          name: string
          payment_method?: string | null
          price: number
          recurrence_type: string
          salon_id: string
          sell_online?: boolean | null
          service_ids?: string[] | null
          start_date?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          cancellable_immediately?: boolean | null
          client_id?: string | null
          created_at?: string | null
          discount?: number | null
          end_date?: string | null
          entries_per_month?: number | null
          geolocation_enabled?: boolean | null
          geolocation_radius?: number | null
          id?: string
          include_all_services?: boolean | null
          max_duration?: number | null
          min_duration?: number | null
          name?: string
          payment_method?: string | null
          price?: number
          recurrence_type?: string
          salon_id?: string
          sell_online?: boolean | null
          service_ids?: string[] | null
          start_date?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
