import { createClient } from "@supabase/supabase-js";
import { PublicSchema, Database, Tables } from "./db/database.types";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

type tableName = keyof PublicSchema["Tables"];

const insertData = async <T extends tableName>(
  tableName: T,
  obj: Tables<T>[],
) => {
  //@ts-ignore
  const { error } = await supabase.from(tableName).insert(obj);
  if (!error) {
    console.log("Successfully inserted into db");
  } else {
    console.error(error);
  }
};

// await insertData("reward", [
//   {
//     id: 2,
//     prestiege: 1,
//     credits: 4,
//     bonus_card: 1,
//     faction_rep: null,
//     prototype: 0,
//     second_place: 0,
//   },
// ]);
