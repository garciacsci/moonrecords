import { createClient } from "@supabase/supabase-js";
import { PublicSchema, Database, Tables } from "./types/supabase.js";
import dotenv from "dotenv";
import * as fs from "fs";
import deepEqual from "deep-equal";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const fileNames = [
  "card/actionCardsData.json",
  "card/contractData.json",
  "card/crewData.json",
  "card/shipPartsData.json",
  "card/objectiveData.json",
  "card/eventsData.json",
];

const [
  actionCardsData,
  contractData,
  crewData,
  shipPartsData,
  objectiveData,
  eventsData,
] = fileNames.map((fileName) => {
  return JSON.parse(fs.readFileSync(fileName, "utf-8"));
});

let normalizedRequirements: any[] = [];
let normalizedRewards: any[] = [];
let normalizedGameElements: any[] = [];

const normalizeRequirement = (data: any) => {
  let { requirements, ...rest } = data;
  if (Array.isArray(requirements)) {
    requirements = requirements[0];
  }
  const value = normalizedRequirements.findIndex((normRequirement) => {
    return deepEqual(normRequirement, requirements);
  });
  if (value === -1) {
    normalizedRequirements.push(requirements);
    return { requirement_id: normalizedRequirements.length, ...rest };
  }
  return { requirement_id: value + 1, ...rest };
};

const normalizeGameElement = (data: any) => {
  let { interact_id, ...rest } = data;
  if (Array.isArray(interact_id)) {
    interact_id = interact_id[0];
  }
  const value = normalizedGameElements.findIndex((normGameElements) => {
    return deepEqual(normGameElements, interact_id);
  });
  if (value === -1) {
    normalizedGameElements.push(interact_id);
    return { interact_id: normalizedGameElements.length, ...rest };
  }
  return { interact_id: value + 1, ...rest };
};

const normalizeReward = (data: any) => {
  const { rewards, ...rest } = data;
  const value = normalizedRewards.findIndex((normRewards) => {
    return deepEqual(normRewards, rewards);
  });
  if (value === -1) {
    normalizedRewards.push(rewards);
    return { reward_id: normalizedRewards.length, ...rest };
  }
  return { reward_id: value + 1, ...rest };
};

const normalizedActionCardsData = actionCardsData
  .map(normalizeRequirement)
  .map((actionCard: any) => {
    const { cardText, cardType, hazard, ...rest } = actionCard;
    return {
      card_text: cardText,
      block_hazard: hazard,
      card_type: cardType,
      ...rest,
    };
  });

const normalizedContractData = contractData
  .map(normalizeRequirement)
  .map(normalizeReward)
  .map((contractCard: any) => {
    const { contractId, cardText, hazards, ...rest } = contractCard;
    return {
      contract_id: contractId,
      hazard_die: hazards,
      card_text: cardText,
      ...rest,
    };
  });

const normalizedCrewData = crewData
  .slice(0, 10)
  .map(normalizeGameElement)
  .map(normalizeRequirement)
  .map((crewCard: any) => {
    const {
      holographic,
      goldHolographic,
      altPrint,
      cardText,
      wikiDescription,
      ruleClarifications,
      play_as_id,
      ...rest
    } = crewCard;
    return {
      is_holographic: holographic,
      is_gold_holographic: goldHolographic || false,
      play_as_id: play_as_id === 0 ? null : play_as_id,
      alt_print: altPrint,
      card_text: cardText,
      wiki_description: wikiDescription,
      rule_clarifications: JSON.stringify(ruleClarifications),
      ...rest,
    };
  });

const normalizedShipParts = shipPartsData
  .slice(0, 10)
  .map(normalizeGameElement)
  .map(normalizeRequirement)
  .map((shipParts: any) => {
    const {
      holographic,
      altPrint,
      cardText,
      wikiDescription,
      ruleClarifications,
      cards,
      play_as_id,
      ...rest
    } = shipParts;
    return {
      is_holographic: holographic,
      cards: 1,
      play_as_id: play_as_id === 0 ? null : play_as_id,
      alt_print: altPrint,
      card_text: cardText,
      wiki_description: wikiDescription,
      rule_clarifications: JSON.stringify(ruleClarifications),
      ...rest,
    };
  });

normalizedRequirements = normalizedRequirements
  .map((requirements: any, idx: number) => {
    return { id: idx + 1, ...requirements };
  })
  .map((requirements) => {
    let { reactors, thrusters, shields, dice, ...rest } = requirements;
    if (!reactors && reactors !== 0) {
      reactors = rest.reactor;
    }
    if (!thrusters && thrusters !== 0) {
      reactors = rest.thruster;
    }
    if (!shields && shields !== 0) {
      reactors = rest.thruster;
    }
    return { shield: shields, reactor: reactors, thruster: thrusters, ...rest };
  });

normalizedRewards = normalizedRewards
  .map((rewards: any, idx: number) => {
    return { id: idx + 1, ...rewards };
  })
  .map((requirements) => {
    let { bonusCard, secondPlace, factionRep, ...rest } = requirements;
    return {
      bonus_card: bonusCard,
      second_place: secondPlace,
      faction_rep: factionRep || null,
      ...rest,
    };
  });

normalizedGameElements = normalizedGameElements
  .map((gameElement: any, idx: number) => {
    const { id, ...rest } = gameElement;
    return { id: idx + 1, ...rest };
  })
  .map((requirements) => {
    let { prestiege, ...rest } = requirements;
    return {
      prestige: prestiege,
      ...rest,
    };
  });

/*
let response = await supabase
  .from("requirement")
  .insert(normalizedRequirements);
console.log("Requirement Table Response: ", response);

response = await supabase.from("reward").insert(normalizedRewards);
console.log("Reward Table Response: ", response);

response = await supabase.from("game_element").insert(normalizedGameElements);
console.log("game_element Table Response: ", response);

response = await supabase.from("action_card").insert(normalizedActionCardsData);
console.log("action_card Table Response: ", response);

response = await supabase.from("contract").insert(normalizedContractData);
console.log("Contract Table Response: ", response);

response = await supabase.from("crew_card").insert(normalizedCrewData);
console.log("crewCard Table Response: ", response);

response = await supabase.from("ship_part").insert(normalizedShipParts);
console.log("ship Part Table Response: ", response);
*/
