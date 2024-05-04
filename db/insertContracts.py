from util import load_and_validate_json, connect_to_db


# JSON Schema for Validation
contract_card_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "collection": {"type": "string"},
            "image": {"type": "string"},
            "type": {"type": "string"},
            "contractId": {"type": "string"},
            "cardText": {"type": ["string", "null"]},
            "sector": {"type": "string"},
            "holographic": {"type": "boolean"},
            "requirements": {
                "type": "object",
                "properties": {
                    "reactors": {"type": "integer"},
                    "damage": {"type": "integer"},
                    "thrusters": {"type": "integer"},
                    "shields": {"type": "integer"},
                    "crew": {"type": "integer"},
                    "flex": {"type": "integer"}
                },
                "required": ["reactors", "damage", "thrusters", "shields", "crew", "flex"]
            },
            "hazards": {"type": "integer"},
            "rewards": {
                "type": "object",
                "properties": {
                    "prestige": {"type": "integer"},
                    "credits": {"type": "integer"},
                    "bonusCard": {"type": "integer"},
                    "factionRep": {"type": ["string", "null"]},
                    "prototype": {"type": "integer"},
                    "secondPlace": {"type": "integer"}
                },
                "required": ["prestige", "credits", "bonusCard", "prototype", "secondPlace"]
            }
        },
        "required": ["name", "collection", "image", "type", "contractId", "cardText", "sector", "holographic", "requirements", "hazards", "rewards"]
    }
}

# Load and validate JSON
contract_data = load_and_validate_json('card/contractData.json', contract_card_schema)

# Connect to the database
connection =  connect_to_db()

# Insert Data
try:
    cursor = connection.cursor() #create cursor object

    # Insert the data into the contract table
    for card in contract_data:



        # Insert card into card table first
        cursor.execute("""
            INSERT INTO card (name, collection, image, card_text)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """, (card['name'], card['collection'], card['image'], card['cardText']))
        card_id = cursor.fetchone()[0]


        # Check if an identical requirement exists
        cursor.execute("""
            SELECT id FROM requirement
            WHERE reactor = %s AND thruster = %s AND shield = %s AND damage = %s AND crew = %s AND flex = %s
        """, (card['requirements']['reactors'], card['requirements']['thrusters'], card['requirements']['shields'],
              card['requirements']['damage'], card['requirements']['crew'], card['requirements']['flex']))
        existing_requirement = cursor.fetchone()

        if existing_requirement:
            # If an identical requirement exists, use its id
            requirement_id = existing_requirement[0]
        else:
            # If no identical requirement exists, insert a new entry into the requirement table
            cursor.execute("""
                INSERT INTO requirement (reactor, thruster, shield, damage, crew, flex)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (card['requirements']['reactors'], card['requirements']['thrusters'], card['requirements']['shields'],
                  card['requirements']['damage'], card['requirements']['crew'], card['requirements']['flex']))
            requirement_id = cursor.fetchone()[0]

        # Check if an identical reward exists
        cursor.execute("""
            SELECT id FROM reward
            WHERE prestiege = %s AND credit = %s AND bonus_card = %s AND prototype = %s
            AND second_place = %s AND faction_rep = %s
        """, (card['rewards']['prestige'], card['rewards']['credits'], card['rewards']['bonusCard'],
              card['rewards']['prototype'], card['rewards']['secondPlace'], card['rewards']['factionRep']))
        existing_reward = cursor.fetchone()

        # Insert rewards into reward table
        if existing_reward:
          # If reward entry already exists
          reward_id = existing_reward[0]
        else:
          cursor.execute("""
              INSERT INTO reward (prestiege, credit, bonus_card, prototype, second_place, faction_rep)
              VALUES (%s, %s, %s, %s, %s, %s)
              RETURNING id
          """, (card['rewards']['prestige'], card['rewards']['credits'], card['rewards']['bonusCard'],
                card['rewards']['prototype'], card['rewards']['secondPlace'], card['rewards']['factionRep']))
          reward_id = cursor.fetchone()[0]

        # Insert into contract table
        cursor.execute("""
            INSERT INTO contract (id, contract_type, contract_id, sector, holographic, hazard_die, requirement_id, reward_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (card_id, card['type'], card['contractId'], card['sector'], card['holographic'], card['hazards'],
              requirement_id, reward_id))
        
        # Commit changes
        connection.commit()
        print("Data inserted successfully.")

except Exception as e:
    connection.rollback() # Roll back transaction if error occurs
    print("error inserting data:")
    print(str(e))

finally:
    cursor.close()
    connection.close()