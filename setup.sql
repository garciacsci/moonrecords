CREATE TYPE "collection_type" AS ENUM(
  'Base Game',
  '1st encounter',
  'Shard',
  'Binding ties',
  'Endless',
  'Dark Matter',
  'Overload',
  'Nomad',
  'Starfall',
  'Intrepid'
);

CREATE TYPE "faction_type" AS ENUM(
  'Henko',
  'Komek',
  'Magnomi',
  'Sorelia',
  'Ventus',
  'Special'
);

CREATE TYPE "card_type" AS ENUM(
  'reactor',
  'damage',
  'thruster',
  'shield',
  'crew',
  'flex',
  'dark_matter',
  'miss'
);


CREATE TYPE "contract_type" AS ENUM(
  'Explore Contract',
  'Kill Contract',
  'Delivery Contract',
  'Rescue Contract',
  'Head to Head',
  'Redacted Contract',
  'Unstable Contract'
);

CREATE TYPE crew_type AS ENUM(
  'Paladin', 
  'Tech', 
  'Pilot', 
  'Merc', 
  'Agent'
);

CREATE TYPE crew_role AS ENUM(
  'Strike Leader',
  'Reactor Expert',
  'Tactical AI',
  'Communications AI',
  'Supply Sergeant',
  'Hot Shot',
  'Bounty Hunter',
  'Scavanger',
  'Fleet Admiral',
  'Scout',
  '2nd Lieutenant',
  'Mine Engineer',
  'Saboteur',
  'Fearless Pilot',
  'Engine Mechanic',
  'Munitions Expert',
  'Sergeant',
  'Ensign',
  'Deck Officer',
  'Navigator',
  'Diplomat',
  'Priest',
  '???',
  'Field Analyst',
  'Regional Director',
  'General',
  'Field Surveyor',
  'Loan Shark',
  'Council Member',
  'Infiltrator',
  'Council Enforcer',
  'Priest of Thieves',
  'Resonate Co-Pilot',
  'Overseer',
  'Translator',
  'Promoter',
  'Resonate Artisan',
  'Procurer',
  'Recruiter',
  'Engine AI',
  'Envoy AI',
  'Reactor AI',
  'Defense AI',
  'Attack AI',
  'Peace Enforcer',
  'Medical Zealot',
  'Reactor Tech',
  'Junker',
  'Shield Tech',
  'Liaison',
  'Helmsman',
  'Machinist',
  'Morimeno',
  'Paradin',
  'Sennoti',
  'Ashbane',
  'Kelvari',
  'Symbiont',
  'Rift Bender'
)



CREATE TABLE IF NOT EXISTS
  "requirement" (
    "id" SERIAL PRIMARY KEY,
    "reactor" INTEGER NOT NULL,
    "damage" INTEGER NOT NULL,
    "thruster" INTEGER NOT NULL,
    "shield" INTEGER NOT NULL,
    "crew" INTEGER NOT NULL,
    "flex" INTEGER NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  "reward" (
    "id" SERIAL PRIMARY KEY,
    "prestiege" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "bonus_card" INTEGER NOT NULL,
    "prototype" INTEGER NOT NULL,
    "second_place" INTEGER NOT NULL,
    "faction_rep" faction_type
  );

CREATE TABLE IF NOT EXISTS
  "contract" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "collection" collection_type NOT NULL,
    "image" TEXT NOT NULL,
    "type" contract_type NOT NULL,
    "contract_id" INTEGER NOT NULL,
    "card_text" TEXT NOT NULL,
    "sector" faction_type NOT NULL,
    "holographic" BOOLEAN NOT NULL,
    "requirement_id" INTEGER REFERENCES "requirement" ("id"),
    "hazard_die" INTEGER NOT NULL,
    "reward_id" INTEGER REFERENCES "reward" ("id"),
    "card_type" card_type NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  "action_card" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "card_text" TEXT NOT NULL,
    "collection" collection_type NOT NULL,
    "block_hazard" INTEGER NOT NULL,
    "action" INTEGER NOT NULL,
    "card" INTEGER NOT NULL,
    "requirement_id" INTEGER REFERENCES "requirement" ("id"),
    "card_type" card_type_enum NOT NULL,
    "is_default_loadout" BOOLEAN NOT NULL DEFAULT FALSE,
    "discrete" BOOLEAN NOT NULL DEFAULT FALSE,
  );

-- set either as null or as 0 when that specific card has no effect
-- maybe set this as json instead of table?
CREATE TABLE IF NOT EXISTS
  "effect" (
    "id" SERIAL PRIMARY KEY,
    "block_hazard" INTEGER,
    "block_hazard_die" INTEGER,
    "negate_hazard" INTEGER, --negate is for die
    "negate_hazard_die" INTEGER,
    "roll_hazard_die" INTEGER,
    "roll_moonroller_die" INTEGER,
    "action" INTEGER,
    "requirement_id" INTEGER REFERENCES "requirement" ("id"),
    "play_as" INTEGER REFERENCES "action_card" ("id"),
    "interact" INTEGER REFERENCES "game_element" ("id")
  );

CREATE TABLE IF NOT EXISTS
  "game_mechanic" (
    "id" SERIAL PRIMARY KEY,
    ""

  )


-- create Game Element as an array of ENUMS?