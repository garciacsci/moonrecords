from util import load_and_validate_json, connect_to_db

ship_part_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "collection": {"type": "string"},
            "image": {"type": "string"},
            "cost": {"type": "integer"},
            "faction": {"type": "string"},
            "cards": {
                "type": "object",
                "properties": {
                  "reactor": {"type": "integer", "default": 0},
                  "shield": {"type": "integer", "default": 0},
                  "thruster": {"type": "integer", "default": 0},
                  "damage": {"type": "integer", "default": 0},
                  "damage2": {"type": "integer", "default": 0},
                  "miss": {"type": "integer", "default": 0},
                  "damage3": {"type": "integer", "default": 0},
                  "shield+": {"type": "integer", "default": 0},
                  "shieldx": {"type": "integer", "default": 0},
                  "reactor+": {"type": "integer", "default": 0},
                  "thruster+": {"type": "integer", "default": 0},
                  "damage+": {"type": "integer", "default": 0},
                  "reactorx": {"type": "integer", "default": 0},
                  "thrusterx": {"type": "integer", "default": 0},
                  "flex": {"type": "integer", "default": 0},
                  "darkMatter": {"type": "integer", "default": 0}
              },
                "additionalProperties": False
            },
            "holographic": {"type": "boolean"},
            "altPrint": {"type": "boolean"},
            "cardText": {"type": "string"},
            "wikiDescription": {"type": "string"},
            "ruleClarifications": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "description": {"type": "string"},
                        "source": {"type": "string"}
                    },
                    "required": ["id", "description"]
                }
            }
        },
        "required": ["id", "name", "collection", "image", "cost", "faction", "cards", "holographic", "altPrint", "cardText", "wikiDescription", "ruleClarifications"]
    }
}

# Load and validate JSON
ship_part_data = load_and_validate_json('card/shipPartsData.json', ship_part_schema)

# Connect to the database
connection = connect_to_db()

# Mapping of card names to their corresponding proper name
action_card_name_mapping = {
    "reactor": "Reactor",
    "shield": "Shield",
    "thruster": "Thruster",
    "damage": "Damage",
    "damage2": "Damage 2",
    "miss": "Miss",
    "damage3": "Damage 3",
    "shield+": "Shield+",
    "shieldx": "Shieldx",
    "reactor+": "Reactor+",
    "thruster+": "Thruster+",
    "damage+": "Damage+",
    "reactorx": "Reactorx",
    "thrusterx": "Thrusterx",
    "darkMatter": "Dark Matter"
}

# Insert Data
try:
    cursor = connection.cursor()  # Create cursor object

    # Insert the data into the card and ship_part tables
    for part in ship_part_data:
        # Insert into card table
        cursor.execute("""
            INSERT INTO card (name, collection, image, card_text)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """, (part['name'], part['collection'], part['image'], part['cardText']))
        
        card_id = cursor.fetchone()[0]

        # Insert into ship_part table
        cursor.execute("""
            INSERT INTO ship_part (id, cost, faction, holographic, alt_print)
            VALUES (%s, %s, %s, %s, %s)
        """, (card_id, part['cost'], part['faction'], part['holographic'], part['altPrint']))

        # Insert into ship_part_action_card_map table
        for card_name, quantity in part['cards'].items():
            if quantity > 0:
                action_card_name = action_card_name_mapping.get(card_name)
                if action_card_name:
                    cursor.execute("""
                        SELECT card.id
                        FROM card
                        JOIN action_card ON card.id = action_card.id
                        WHERE card.name = %s AND action_card.is_discrete = true
                        LIMIT 1
                    """, (action_card_name,))
                    action_card_id = cursor.fetchone()[0]
                    if action_card_id:
                        cursor.execute("""
                            INSERT INTO ship_part_action_card_map (ship_part_id, action_card_id, quantity)
                            VALUES (%s, %s, %s)
                        """, (card_id, action_card_id, quantity))

        # Commit changes
        connection.commit()
        print(f"Data for ship part {part['name']} inserted successfully.")

except Exception as e:
    connection.rollback()  # Roll back the transaction if an error occurred
    print("Error inserting data into the database.")
    print(str(e))

finally:
    cursor.close()
    connection.close()