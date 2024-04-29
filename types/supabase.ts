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
          action: number
          block_hazard: number
          card: number
          card_text: string
          card_type: Database["public"]["Enums"]["card_type"]
          collection: Database["public"]["Enums"]["collection_type"]
          discrete: boolean
          id: number
          image: string
          is_default_loadout: boolean
          name: string
          requirement_id: number | null
        }
        Insert: {
          action: number
          block_hazard: number
          card: number
          card_text: string
          card_type: Database["public"]["Enums"]["card_type"]
          collection: Database["public"]["Enums"]["collection_type"]
          discrete?: boolean
          id?: number
          image: string
          is_default_loadout?: boolean
          name: string
          requirement_id?: number | null
        }
        Update: {
          action?: number
          block_hazard?: number
          card?: number
          card_text?: string
          card_type?: Database["public"]["Enums"]["card_type"]
          collection?: Database["public"]["Enums"]["collection_type"]
          discrete?: boolean
          id?: number
          image?: string
          is_default_loadout?: boolean
          name?: string
          requirement_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "action_card_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirement"
            referencedColumns: ["id"]
          },
        ]
      }
      condition: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          id: number
          interact_id: number | null
          requirement_id: number | null
        }
        Insert: {
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          id?: number
          interact_id?: number | null
          requirement_id?: number | null
        }
        Update: {
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          id?: number
          interact_id?: number | null
          requirement_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "condition_interact_id_fkey"
            columns: ["interact_id"]
            isOneToOne: false
            referencedRelation: "game_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "condition_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirement"
            referencedColumns: ["id"]
          },
        ]
      }
      contract: {
        Row: {
          card_text: string
          collection: Database["public"]["Enums"]["collection_type"]
          contract_id: number
          hazard_die: number
          holographic: boolean
          id: number
          image: string
          name: string
          requirement_id: number | null
          reward_id: number | null
          sector: Database["public"]["Enums"]["faction_type"]
          type: Database["public"]["Enums"]["contract_type"]
        }
        Insert: {
          card_text: string
          collection: Database["public"]["Enums"]["collection_type"]
          contract_id: number
          hazard_die: number
          holographic: boolean
          id?: number
          image: string
          name: string
          requirement_id?: number | null
          reward_id?: number | null
          sector: Database["public"]["Enums"]["faction_type"]
          type: Database["public"]["Enums"]["contract_type"]
        }
        Update: {
          card_text?: string
          collection?: Database["public"]["Enums"]["collection_type"]
          contract_id?: number
          hazard_die?: number
          holographic?: boolean
          id?: number
          image?: string
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
      crew_card: {
        Row: {
          alt_print: boolean
          card_text: string
          collection: Database["public"]["Enums"]["collection_type"]
          cost: number
          faction: Database["public"]["Enums"]["faction_type"]
          height: string
          id: number
          image: string
          interact_id: number | null
          is_gold_holographic: boolean
          is_holographic: boolean
          name: string
          play_as_id: number | null
          requirement_id: number | null
          role: Database["public"]["Enums"]["crew_role"]
          rule_clarifications: Json | null
          type: Database["public"]["Enums"]["crew_type"]
          wiki_description: string
        }
        Insert: {
          alt_print: boolean
          card_text: string
          collection: Database["public"]["Enums"]["collection_type"]
          cost: number
          faction: Database["public"]["Enums"]["faction_type"]
          height: string
          id?: number
          image: string
          interact_id?: number | null
          is_gold_holographic?: boolean
          is_holographic: boolean
          name: string
          play_as_id?: number | null
          requirement_id?: number | null
          role: Database["public"]["Enums"]["crew_role"]
          rule_clarifications?: Json | null
          type: Database["public"]["Enums"]["crew_type"]
          wiki_description: string
        }
        Update: {
          alt_print?: boolean
          card_text?: string
          collection?: Database["public"]["Enums"]["collection_type"]
          cost?: number
          faction?: Database["public"]["Enums"]["faction_type"]
          height?: string
          id?: number
          image?: string
          interact_id?: number | null
          is_gold_holographic?: boolean
          is_holographic?: boolean
          name?: string
          play_as_id?: number | null
          requirement_id?: number | null
          role?: Database["public"]["Enums"]["crew_role"]
          rule_clarifications?: Json | null
          type?: Database["public"]["Enums"]["crew_type"]
          wiki_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "crew_card_interact_id_fkey"
            columns: ["interact_id"]
            isOneToOne: false
            referencedRelation: "game_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_card_play_as_id_fkey"
            columns: ["play_as_id"]
            isOneToOne: false
            referencedRelation: "action_card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_card_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirement"
            referencedColumns: ["id"]
          },
        ]
      }
      game_element: {
        Row: {
          action: number | null
          allies: number | null
          armory: boolean | null
          block_hazard: number | null
          block_hazard_die: number | null
          card: number | null
          card_type: Database["public"]["Enums"]["card_type"][] | null
          credit: number | null
          discard: boolean | null
          discard_pile: boolean | null
          draw_pile: boolean | null
          faction_rep: number | null
          gain_io: number | null
          hand: boolean | null
          id: number
          negate_hazard: number | null
          negate_hazard_die: number | null
          objective_card: number | null
          played: boolean | null
          prestige: number | null
          roll_hazard_die: number | null
          roll_moonroller_die: number | null
          spend_io: number | null
          supply: boolean | null
          trash: boolean | null
        }
        Insert: {
          action?: number | null
          allies?: number | null
          armory?: boolean | null
          block_hazard?: number | null
          block_hazard_die?: number | null
          card?: number | null
          card_type?: Database["public"]["Enums"]["card_type"][] | null
          credit?: number | null
          discard?: boolean | null
          discard_pile?: boolean | null
          draw_pile?: boolean | null
          faction_rep?: number | null
          gain_io?: number | null
          hand?: boolean | null
          id?: number
          negate_hazard?: number | null
          negate_hazard_die?: number | null
          objective_card?: number | null
          played?: boolean | null
          prestige?: number | null
          roll_hazard_die?: number | null
          roll_moonroller_die?: number | null
          spend_io?: number | null
          supply?: boolean | null
          trash?: boolean | null
        }
        Update: {
          action?: number | null
          allies?: number | null
          armory?: boolean | null
          block_hazard?: number | null
          block_hazard_die?: number | null
          card?: number | null
          card_type?: Database["public"]["Enums"]["card_type"][] | null
          credit?: number | null
          discard?: boolean | null
          discard_pile?: boolean | null
          draw_pile?: boolean | null
          faction_rep?: number | null
          gain_io?: number | null
          hand?: boolean | null
          id?: number
          negate_hazard?: number | null
          negate_hazard_die?: number | null
          objective_card?: number | null
          played?: boolean | null
          prestige?: number | null
          roll_hazard_die?: number | null
          roll_moonroller_die?: number | null
          spend_io?: number | null
          supply?: boolean | null
          trash?: boolean | null
        }
        Relationships: []
      }
      objective: {
        Row: {
          card_text: string
          collection: Database["public"]["Enums"]["collection_type"]
          condition: number | null
          id: number
          image: string
          name: string
          prestige: number
        }
        Insert: {
          card_text: string
          collection: Database["public"]["Enums"]["collection_type"]
          condition?: number | null
          id?: number
          image: string
          name: string
          prestige: number
        }
        Update: {
          card_text?: string
          collection?: Database["public"]["Enums"]["collection_type"]
          condition?: number | null
          id?: number
          image?: string
          name?: string
          prestige?: number
        }
        Relationships: [
          {
            foreignKeyName: "objective_condition_fkey"
            columns: ["condition"]
            isOneToOne: false
            referencedRelation: "condition"
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
          prestige: number
          prototype: number
          second_place: number
        }
        Insert: {
          bonus_card: number
          credits: number
          faction_rep?: Database["public"]["Enums"]["faction_type"] | null
          id?: number
          prestige: number
          prototype: number
          second_place: number
        }
        Update: {
          bonus_card?: number
          credits?: number
          faction_rep?: Database["public"]["Enums"]["faction_type"] | null
          id?: number
          prestige?: number
          prototype?: number
          second_place?: number
        }
        Relationships: []
      }
      ship_part: {
        Row: {
          alt_print: boolean
          card_text: string
          cards: number | null
          collection: Database["public"]["Enums"]["collection_type"]
          cost: number
          faction: Database["public"]["Enums"]["faction_type"]
          id: number
          image: string
          interact_id: number | null
          is_holographic: boolean
          name: string
          play_as_id: number | null
          requirement_id: number | null
          rule_clarifications: Json | null
          wiki_description: string
        }
        Insert: {
          alt_print: boolean
          card_text: string
          cards?: number | null
          collection: Database["public"]["Enums"]["collection_type"]
          cost: number
          faction: Database["public"]["Enums"]["faction_type"]
          id?: number
          image: string
          interact_id?: number | null
          is_holographic: boolean
          name: string
          play_as_id?: number | null
          requirement_id?: number | null
          rule_clarifications?: Json | null
          wiki_description: string
        }
        Update: {
          alt_print?: boolean
          card_text?: string
          cards?: number | null
          collection?: Database["public"]["Enums"]["collection_type"]
          cost?: number
          faction?: Database["public"]["Enums"]["faction_type"]
          id?: number
          image?: string
          interact_id?: number | null
          is_holographic?: boolean
          name?: string
          play_as_id?: number | null
          requirement_id?: number | null
          rule_clarifications?: Json | null
          wiki_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "ship_part_cards_fkey"
            columns: ["cards"]
            isOneToOne: false
            referencedRelation: "action_card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ship_part_interacts_fkey"
            columns: ["interact_id"]
            isOneToOne: false
            referencedRelation: "game_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ship_part_play_as_fkey"
            columns: ["play_as_id"]
            isOneToOne: false
            referencedRelation: "action_card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ship_part_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirement"
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
      card_type:
        | "reactor"
        | "damage"
        | "thruster"
        | "shield"
        | "crew"
        | "flex"
        | "dark_matter"
        | "miss"
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
      crew_role:
        | "Strike Leader"
        | "Reactor Expert"
        | "Tactical AI"
        | "Communications AI"
        | "Supply Sergeant"
        | "Hot Shot"
        | "Bounty Hunter"
        | "Scavanger"
        | "Fleet Admiral"
        | "Scout"
        | "2nd Lieutenant"
        | "Mine Engineer"
        | "Saboteur"
        | "Fearless Pilot"
        | "Engine Mechanic"
        | "Munitions Expert"
        | "Sergeant"
        | "Ensign"
        | "Deck Officer"
        | "Navigator"
        | "Diplomat"
        | "Priest"
        | "???"
        | "Field Analyst"
        | "Regional Director"
        | "General"
        | "Field Surveyor"
        | "Loan Shark"
        | "Council Member"
        | "Infiltrator"
        | "Council Enforcer"
        | "Priest of Thieves"
        | "Resonate Co-Pilot"
        | "Overseer"
        | "Translator"
        | "Promoter"
        | "Resonate Artisan"
        | "Procurer"
        | "Recruiter"
        | "Engine AI"
        | "Envoy AI"
        | "Reactor AI"
        | "Defense AI"
        | "Attack AI"
        | "Peace Enforcer"
        | "Medical Zealot"
        | "Reactor Tech"
        | "Junker"
        | "Shield Tech"
        | "Liaison"
        | "Helmsman"
        | "Machinist"
        | "Morimeno"
        | "Paradin"
        | "Sennoti"
        | "Ashbane"
        | "Kelvari"
        | "Symbiont"
        | "Rift Bender"
      crew_type: "Paladin" | "Tech" | "Pilot" | "Merc" | "Agent"
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
