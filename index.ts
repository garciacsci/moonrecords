import { createClient } from "@supabase/supabase-js";
import { PublicSchema, Database, Tables } from "./db/database.types";
import dotenv from "dotenv";
import * as fs from "fs";
import deepEqual from "deep-equal";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

type tableName = keyof PublicSchema["Tables"];

let fileContent = fs.readFileSync("./card/actionCardsData.json", "utf-8");

const action_card = JSON.parse(fileContent);
const actionRequirements = action_card.map((data: any, id: number) => {
  const { requirements, ...rest } = data;
  return { id: id + 1, ...requirements };
});

let response = await supabase.from("requirement").insert(actionRequirements);
// console.log(response);

let res = await supabase.from("requirement").select();
const updatedActionCard = action_card.map((cardData: any, id: number) => {
  const { requirements, ...rest } = cardData;
  return { requirement_id: res.data![id].id, ...rest };
});

// response = await supabase.from("action_card").insert(updatedActionCard);
// console.log(response);

function shallowCompare(newObj: any, prevObj: any) {
  for (const key in newObj) {
    if (newObj[key] !== prevObj[key]) return false;
  }
  return true;
}

fileContent = fs.readFileSync("./card/contractData.json", "utf-8");
const contractData = JSON.parse(fileContent);

let latestActionCardId = actionRequirements.length;
const contractRequirements = contractData.map((data: any, id: number) => {
  const { requirements, ...rest } = data;
  const { dice, ...restRequirements } = requirements;
  return { id: latestActionCardId + id + 1, ...restRequirements };
});
// response = await supabase.from("requirement").insert(contractRequirements);
// console.log(response);

const contractReward = contractData.map((data: any, id: number) => {
  const { rewards, ...rest } = data;
  if (rewards.faction_rep.length === 0) {
    rewards.faction_rep = null;
  }

  return { id: id + 1, ...rewards };
});

// response = await supabase.from("reward").insert(contractReward);
// console.log(response);

const updatedContractData = contractData
  .map((contract: any, id: number) => {
    const { requirements, ...rest } = contract;

    const matchingReward = res.data?.find((e) => {
      const { id, ...rest } = e;
      return shallowCompare(requirements, rest);
    });

    if (!matchingReward) {
      return { requirement_id: latestActionCardId + id + 1, ...rest };
    } else {
      return { requirement_id: matchingReward.id, ...rest };
    }
  })
  .map((contract: any, id: number) => {
    const { rewards, ...rest } = contract;
    return { reward_id: id + 1, ...rest };
  });

// response = await supabase.from("contract").insert(updatedContractData);
// console.log(response);

const { data } = await supabase
  .from("requirement")
  .select("id")
  .order("id", { ascending: false })
  .limit(1);

latestActionCardId = data![0].id;
const crewDataFile = fs.readFileSync("./card/crewData.json", "utf-8");

let crewData = JSON.parse(crewDataFile);
crewData = crewData.slice(0, 10);

let crewDataGameElement = crewData.map((crewData: any, idx: number) => {
  const { id, ...rest } = crewData.interact_id[0];
  return { id: idx + 1, ...rest };
});

// response = await supabase.from("game_element").insert(crewDataGameElement);
// console.log(response)

crewData = crewData
  .map((crewData: any, idx: number) => {
    let { requirements, ...rest } = crewData;
    requirements = requirements[0];

    const matchingReward = res.data?.find((e) => {
      const { id, ...rest } = e;
      return shallowCompare(requirements, rest);
    });

    if (!matchingReward) {
      return { requirement_id: latestActionCardId + idx + 1, ...rest };
    } else {
      return { requirement_id: matchingReward.id, ...rest };
    }
  })
  .map((crewData: any, id: number) => {
    crewData.interact_id = id + 1;
    return crewData;
  })
  .map((crewData: any) => {
    crewData.rule_clarifications = JSON.stringify(crewData.rule_clarifications);
    return crewData;
  })
  .map((crewData: any) => {
    const { holographic, goldHolographic, ...rest } = crewData;
    return {
      is_holographic: holographic,
      is_gold_holographic: goldHolographic ?? false,
      ...rest,
    };
  });

// response = await supabase.from("crew_card").insert(crewData);
// console.log(response);

const shipPartsFile = fs.readFileSync("./card/shipPartsData.json", "utf-8");
let shipPartsData = JSON.parse(shipPartsFile);

shipPartsData = shipPartsData.slice(0, 10);

let r = await supabase
  .from("game_element")
  .select()
  .order("id", { ascending: false });

let shipDataGameElement = shipPartsData
  .map((crewData: any, idx: number) => {
    const { id, ...a } = crewData.interact_id[0];

    const matchingReward = r.data?.find((e) => {
      const { id, ...rest } = e;
      return deepEqual(a, rest);
    });

    if (!matchingReward) {
      return a;
    }
  })
  .filter((a) => {
    return a != undefined;
  });

// console.log(shipDataGameElement)

// response = await supabase.from("game_element").insert(shipDataGameElement);
// console.log(response)

r = await supabase
  .from("game_element")
  .select()
  .order("id", { ascending: false });

const latestGameElementId = r.data![0].id;

shipPartsData = shipPartsData
  .map((shipData: any, id: number) => {
    let { requirements, ...rest } = shipData;
    requirements = requirements[0];

    const matchingReward = res.data?.find((e) => {
      const { id, ...rest } = e;
      return deepEqual(requirements, rest);
    });

    if (!matchingReward) {
      return { requirement_id: latestActionCardId + id + 1, ...rest };
    } else {
      return { requirement_id: matchingReward.id, ...rest };
    }
  })
  .map((shipData: any, idx: number) => {
    let { interact_id, ...rest } = shipData;
    let { id, ...gameElementInfo } = interact_id[0];

    const matchingId = r.data?.find((e) => {
      const { id, ...rest } = e;
      return deepEqual(gameElementInfo, rest);
    });

    return { interact_id: matchingId.id, ...rest };
  })
  .map((crewData: any) => {
    let { ruleClarifications, ...rest } = crewData;
    ruleClarifications = JSON.stringify(ruleClarifications);
    return { rule_clarifications: ruleClarifications, ...rest };
  })
  .map((crewData: any) => {
    const {
      wikiDescription,
      cardText,
      altPrint,
      holographic,
      goldHolographic,
      ...rest
    } = crewData;
    return {
      is_holographic: holographic,
      alt_print: altPrint,
      card_text: cardText,
      wiki_description: wikiDescription,
      ...rest,
    };
  });
// console.log(shipPartsData);

// response = await supabase.from("ship_part").insert(shipPartsData);
// console.log(response);
