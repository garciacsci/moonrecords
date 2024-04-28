import { createClient } from "@supabase/supabase-js";
import { PublicSchema, Database, Tables } from "./db/database.types";
import dotenv from "dotenv";

import * as fs from "fs";
import { match } from "assert";

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

await supabase.from("requirement").insert(actionRequirements);

let res = await supabase.from("requirement").select();
const updatedActionCard = action_card.map((cardData: any, id: number) => {
  return { requirement_id: res.data![id].id, ...cardData };
});
await supabase.from("action_card").insert(updatedActionCard);

function shallowCompare(newObj: any, prevObj: any) {
  for (const key in newObj) {
    if (newObj[key] !== prevObj[key]) return false;
  }
  return true;
}

fileContent = fs.readFileSync("./card/contractData.json", "utf-8");
const contractData = JSON.parse(fileContent);

// res = await supabase
//   .from("requirement")
//   .select("id")
//   .order("id", { ascending: false })
//   .limit(1);
const latestActionCardId = 15;

const contractRequirements = contractData.map((data: any, id: number) => {
  const { requirements, ...rest } = data;
  if (!requirements.dice) {
    requirements.dice = 0;
  }
  return { id: latestActionCardId + id + 1, ...requirements };
});

// const response = await supabase
  // .from("requirement")
  // .insert(contractRequirements);

const contractReward = contractData.map((data: any, id: number) => {
  const { rewards, ...rest } = data;
  if (rewards.faction_rep.length === 0){
    rewards.faction_rep = null
  } 

  return { id: id + 1, ...rewards };
});

// const response = await supabase.from("reward").insert(contractReward);
// console.log(response)

const temp = contractData
  .map((contract: any, id: number) => {
    const { requirements, ...rest } = contract;

    const matchingReward = res.data?.find((e) => {
      const { id, ...rest } = e;
      return shallowCompare(requirements, rest);
    });

    if (!matchingReward) {
      // need to figure out latestactioncardid
      return { requirement_id: latestActionCardId + id, ...rest };
    } else {
      return { requirement_id: matchingReward.id, ...rest };
    }
  })
  .map((contract: any, id: number) => {
    const { rewards, ...rest } = contract;
    return { reward_id: id + 1, ...rest };
  });

const response = await supabase.from("contract").insert(temp);
console.log(response)
