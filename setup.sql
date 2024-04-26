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
  'Reactor',
  'Damage',
  'Thrusters',
  'Shields',
  'Crew',
  'Flex',
  'Dark Matter',
  'Miss'
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

CREATE TYPE crew_type AS ENUM('Merc', 'Agent', 'Paladin');


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
    "card_text" TEXT NOT NULL,
    "is_holographic" BOOLEAN NOT NULL,
    "hazardDice" INTEGER NOT NULL,
    "collection" collection_type NOT NULL,
    "type" contract_type NOT NULL,
    "sector" faction_type NOT NULL,
    "requirement_id" INTEGER REFERENCES "requirement" ("id"),
    "reward_id" INTEGER REFERENCES "reward" ("id")
  );

CREATE TABLE IF NOT EXISTS
  "action_card" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "card_text" TEXT NOT NULL,
    "collection" collection_type NOT NULL,
    "card_type" card_type_enum NOT NULL,
    "discrete" INTEGER NOT NULL,
    "requirement_id" INTEGER REFERENCES "requirement" ("id"),
    "effect_id" INTEGER REFERENCES "action_card_effect" ("id")
  );

-- set either as null or as 0 when that specific card has no effect
-- maybe set this as json instead of table?
CREATE TABLE IF NOT EXISTS
  "action_card_effect" (
    "id" SERIAL PRIMARY KEY,
    "block_hazard" INTEGER,
    "block_hazard_die" INTEGER,
    "card" INTEGER REFERENCES "action_card" ("id"),
    "action" INTEGER,
    -- "is_system_error" BOOLEAN DEFAULT FALSE,
    -- "is_idle_substance" BOOLEAN DEFAULT FALSE
  );

-- create Game Element as an array of ENUMS?