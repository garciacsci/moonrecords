CREATE TYPE "collection_type" AS ENUM(
  'base_game',
  '1st_encounter',
  'shard',
  'binding_ties',
  'endless',
  'dark_matter',
  'overload',
  'nomad',
  'starfall',
  'intrepid'
);

CREATE TYPE "faction_type" AS ENUM(
  'henko',
  'komek',
  'magnomi',
  'sorelia',
  'ventus',
  'special'
);

CREATE TYPE "action_card_type" AS ENUM(
  'reactor',
  'thruster',
  'shield',
  'damage',
  'miss',
  'crew',
  'dark_matter'
);


CREATE TYPE "contract_type" AS ENUM(
  'explore',
  'kill',
  'delivery',
  'rescue',
  'head_to_head',
  'redacted',
  'unstable'
);

CREATE TYPE "crew_type" AS ENUM(
  'paladin', 
  'tech', 
  'pilot', 
  'merc', 
  'agent'
);

CREATE TYPE "crew_role_type" AS ENUM(
  'strike_leader',
  'reactor_expert',
  'tactical_ai',
  'communications_ai',
  'supply_sergeant',
  'hot_shot',
  'bounty_hunter',
  'scavanger',
  'fleet_admiral',
  'scout',
  '2nd_lieutenant',
  'mine_engineer',
  'saboteur',
  'fearless_pilot',
  'engine_mechanic',
  'munitions_expert',
  'sergeant',
  'ensign',
  'deck_officer',
  'navigator',
  'diplomat',
  'priest',
  '???',
  'field_analyst',
  'regional_director',
  'general',
  'field_surveyor',
  'loan_shark',
  'council_member',
  'infiltrator',
  'council_enforcer',
  'priest_of_thieves',
  'resonate_co_pilot',
  'overseer',
  'translator',
  'promoter',
  'resonate_artisan',
  'procurer',
  'recruiter',
  'engine_ai',
  'envoy_ai',
  'reactor_ai',
  'defense_ai',
  'attack_ai',
  'peace_enforcer',
  'medical_zealot',
  'reactor_tech',
  'junker',
  'shield_tech',
  'liaison',
  'helmsman',
  'machinist',
  'morimeno',
  'paradin',
  'sennoti',
  'ashbane',
  'kelvari',
  'symbiont',
  'rift_bender',
);

CREATE TYPE "event_type" AS ENUM (
  'event',
  'policy'
);

CREATE TABLE "requirement" (
  "id" SERIAL PRIMARY KEY,
  "reactor" INTEGER NOT NULL,
  "thruster" INTEGER NOT NULL,
  "shield" INTEGER NOT NULL,
  "damage" INTEGER NOT NULL,
  "crew" INTEGER NOT NULL,
  "flex" INTEGER NOT NULL
);

CREATE TABLE "reward" (
  "id" SERIAL PRIMARY KEY,
  "prestiege" INTEGER NOT NULL DEFAULT 0,
  "credit" INTEGER NOT NULL DEFAULT 0,
  "bonus_card" INTEGER NOT NULL DEFAULT 0,
  "prototype" INTEGER NOT NULL DEFAULT 0,
  "second_place" INTEGER NOT NULL DEFAULT 0, --number of credits awarded 2nd place on headt-to-head contract
  "faction_rep" faction_type DEFAULT NULL
);

-- Base table for all cards
CREATE TABLE "card" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "collection" collection_type NOT NULL,
  "image" VARCHAR(255) NOT NULL,
  "card_text" TEXT
);

CREATE TABLE "contract" (
  "id" INTEGER PRIMARY KEY REFERENCES "card"("id"),
  "contract_type" contract_type NOT NULL,
  "contract_id" INTEGER NOT NULL,
  "sector" faction_type NOT NULL,
  "holographic" BOOLEAN DEFAULT false,
  "hazard_die" INTEGER NOT NULL,
  "requirement_id" INTEGER REFERENCES "requirement"("id"),
  "reward_id" INTEGER REFERENCES "reward"("id")
);


CREATE TABLE "action_card" (
	"id" INTEGER PRIMARY KEY REFERENCES "card"("id"),
	"action_card_type" action_card_type NOT NULL,
	"is_discrete" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "effect" (
  "id" SERIAL PRIMARY KEY,
  "effect_type" VARCHAR(50) NOT NULL,
  "effect_value_numeric" INTEGER,
  "effect_value_text" INTEGER,
  "is_variable_effect_value" BOOLEAN NOT NULL DEFAULT false,
  "referenced_card_id" INTEGER REFERENCES "action_card"("id") DEFAULT NULL,
  "info" TEXT
);

CREATE TABLE "card_effect_map" (
  "card_id" INTEGER REFERENCES "card"("id"),
  "effect_id" INTEGER REFERENCES "effect"("id"),
  PRIMARY KEY ("card_id", "effect_id")
);

CREATE TABLE "condition" (
  "id" SERIAL PRIMARY KEY,
  "condition_type" VARCHAR(50) NOT NULL,
  "condition_value_numeric" INTEGER,
  "condition_value_text" VARCHAR(50),
  "is_variable_condition_value" BOOLEAN NOT NULL DEFAULT false,
  "referenced_card_id" INTEGER REFERENCES "action_card"("id") DEFAULT NULL,
  "info" TEXT
);

CREATE TABLE "card_condition_map" (
  "card_id" INTEGER REFERENCES "card"("id"),
  "condition_id" INTEGER REFERENCES "condition"("id"),
  PRIMARY KEY ("card_id", "condition_id")
);
	
CREATE TABLE "crew" (
  "id" INTEGER PRIMARY KEY REFERENCES "card"("id"),
  "action_card_type" action_card_type NOT NULL DEFAULT 'crew',
	"cost" INTEGER NOT NULL,
	"faction" faction_type NOT NULL,
  "role" crew_role_type NOT NULL,
  "type" crew_type NOT NULL,
  "height" DECIMAL NOT NULL, -- feet and inches converted to meters
  "is_holographic" BOOLEAN NOT NULL DEFAULT false,
  "is_gold_holographic" BOOLEAN NOT NULL DEFAULT false,
  "alt_print" BOOLEAN NOT NULL DEFAULT false,
  "wiki_description" VARCHAR(255),
  "rule_clarification" jsonb
);

CREATE TABLE "ship_part" (
  "id" INTEGER PRIMARY KEY REFERENCES "card"("id"),
  "cost" INTEGER NOT NULL,
  "faction" faction_type NOT NULL,
  "holographic" BOOLEAN NOT NULL DEFAULT false,
  "alt_print" BOOLEAN NOT NULL DEFAULT false,
  "wiki_description" VARCHAR (255),
  "rule_clarification" jsonb
);

CREATE TABLE "ship_part_action_card_map" (
  "ship_part_id" INTEGER REFERENCES "ship_part"("id"),
  "action_card_id" INTEGER REFERENCES "action_card"("id"),
  "quantity" INTEGER NOT NULL,
  PRIMARY KEY ("ship_part_id", "action_card_id")
);

CREATE TABLE "objective" (
  "id" INTEGER PRIMARY KEY REFERENCES "card"("id"),
  "prestiege" INTEGER DEFAULT 1
);

CREATE TABLE "event" (
  "id" INTEGER PRIMARY KEY REFERENCES "card"("id"),
  "type" event_type NOT NULL
);