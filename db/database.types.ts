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
      action_card: {
        Row: {
          card_text: string
          card_type: Database["public"]["Enums"]["card_type_enum"]
          collection: Database["public"]["Enums"]["collection_type"]
          discrete: number
          effect_id: number | null
          id: number
          image: string
          name: string
          requirement_id: number | null
        }
        Insert: {
          card_text: string
          card_type: Database["public"]["Enums"]["card_type_enum"]
          collection: Database["public"]["Enums"]["collection_type"]
          discrete: number
          effect_id?: number | null
          id?: number
          image: string
          name: string
          requirement_id?: number | null
        }
        Update: {
          card_text?: string
          card_type?: Database["public"]["Enums"]["card_type_enum"]
          collection?: Database["public"]["Enums"]["collection_type"]
          discrete?: number
          effect_id?: number | null
          id?: number
          image?: string
          name?: string
          requirement_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "action_card_effect_id_fkey"
            columns: ["effect_id"]
            isOneToOne: false
            referencedRelation: "action_card_effect"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_card_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirement"
            referencedColumns: ["id"]
          },
        ]
      }
      action_card_effect: {
        Row: {
          action: number | null
          block_hazard: number | null
          card: number | null
          id: number
          is_idle_substance: boolean | null
          is_system_error: boolean | null
        }
        Insert: {
          action?: number | null
          block_hazard?: number | null
          card?: number | null
          id?: number
          is_idle_substance?: boolean | null
          is_system_error?: boolean | null
        }
        Update: {
          action?: number | null
          block_hazard?: number | null
          card?: number | null
          id?: number
          is_idle_substance?: boolean | null
          is_system_error?: boolean | null
        }
        Relationships: []
      }
      contract: {
        Row: {
          card_text: string
          collection: Database["public"]["Enums"]["collection_type"]
          hazardDice: number
          holographic: boolean
          id: number
          name: string
          requirement_id: number | null
          reward_id: number | null
          sector: Database["public"]["Enums"]["faction_type"]
          type: Database["public"]["Enums"]["contract_type"]
        }
        Insert: {
          card_text: string
          collection: Database["public"]["Enums"]["collection_type"]
          hazardDice: number
          holographic: boolean
          id?: number
          name: string
          requirement_id?: number | null
          reward_id?: number | null
          sector: Database["public"]["Enums"]["faction_type"]
          type: Database["public"]["Enums"]["contract_type"]
        }
        Update: {
          card_text?: string
          collection?: Database["public"]["Enums"]["collection_type"]
          hazardDice?: number
          holographic?: boolean
          id?: number
          name?: string
          requirement_id?: number | null
          reward_id?: number | null
          sector?: Database["public"]["Enums"]["faction_type"]
          type?: Database["public"]["Enums"]["contract_type"]
        }
        Relationships: [
          {
            foreignKeyName: "contract_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "reward"
            referencedColumns: ["id"]
          },
        ]
      }
      requirement: {
        Row: {
          crew: number
          damage: number
          flex: number
          id: number
          reactor: number
          shield: number
          thruster: number
        }
        Insert: {
          crew: number
          damage: number
          flex: number
          id?: number
          reactor: number
          shield: number
          thruster: number
        }
        Update: {
          crew?: number
          damage?: number
          flex?: number
          id?: number
          reactor?: number
          shield?: number
          thruster?: number
        }
        Relationships: []
      }
      reward: {
        Row: {
          bonus_card: number
          credits: number
          faction_rep: Database["public"]["Enums"]["faction_type"] | null
          id: number
          prestiege: number
          prototype: number
          second_place: number
        }
        Insert: {
          bonus_card: number
          credits: number
          faction_rep?: Database["public"]["Enums"]["faction_type"] | null
          id?: number
          prestiege: number
          prototype: number
          second_place: number
        }
        Update: {
          bonus_card?: number
          credits?: number
          faction_rep?: Database["public"]["Enums"]["faction_type"] | null
          id?: number
          prestiege?: number
          prototype?: number
          second_place?: number
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
      card_type:
        | "Reactor"
        | "Damage"
        | "Thrusters"
        | "Shields"
        | "Crew"
        | "Flex"
        | "Dark Matter"
        | "Miss"
      card_type_enum:
        | "Reactor"
        | "Damage"
        | "Thrusters"
        | "Shields"
        | "Crew"
        | "Flex"
        | "Dark Matter"
      collection_type:
        | "Base Game"
        | "1st encounter"
        | "Shard"
        | "Binding ties"
        | "Endless"
        | "Dark Matter"
        | "Overload"
        | "Nomad"
        | "Starfall"
        | "Intrepid"
      contract_type:
        | "Explore Contract"
        | "Kill Contract"
        | "Delivery Contract"
        | "Rescue Contract"
        | "Head to Head"
        | "Redacted Contract"
        | "Unstable Contract"
      faction_type:
        | "Henko"
        | "Komek"
        | "Magnomi"
        | "Sorelia"
        | "Ventus"
        | "Special"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
