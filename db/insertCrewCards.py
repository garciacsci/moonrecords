from util import load_and_validate_json, connect_to_db
import json

# JSON Schema for Validation
crew_card_schema = {
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
            "role": {"type": "string"},
            "type": {"type": "string"},
            "height": {"type": "number"},
            "holographic": {"type": "boolean"},
            "goldHolographic": {"type": "boolean"},
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
                    "required": ["id", "description", "source"]
                }
            }
        },
        "required": [
            "id", "name", "collection", "image", "cost", "faction", "role", "type",
            "height", "holographic", "altPrint", "cardText", "wikiDescription"
        ]
    }
}


# Load and validate JSON
crew_data = load_and_validate_json('card/crewData.json', crew_card_schema)

# Connect to the database
connection =  connect_to_db()

# Insert Data
try:
    cursor = connection.cursor() #create cursor object

    # Insert the data into the card table
    for card in crew_data:
        cursor.execute("""
            INSERT INTO card(name, collection, image, card_text)
            VALUES(%s, %s, %s, %s)
            RETURNING id
        """, (card['name'], card['collection'], card['image'], card['cardText']))
        card_id = cursor.fetchone()[0]

        # Convert ruleClarifications to JSON
        if 'ruleClarifications' in card:
          rule_clarifications_json = json.dumps(card['ruleClarifications'])
        else:
          rule_clarifications_json = None

        if 'goldHolographic' not in card:
            gold_holographic = False
        else:
            gold_holographic = card['goldHolographic']

        # Insert the data into the crew table
        cursor.execute("""
            INSERT INTO crew(id, cost, faction, role, type, height, is_holographic, is_gold_holographic, alt_print, wiki_description, rule_clarification)
            VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (card_id, card['cost'], card['faction'], card['role'], card['type'], card['height'], card['holographic'], gold_holographic, card['altPrint'], card['wikiDescription'], rule_clarifications_json))

        # Commit changes
        connection.commit()
        print("Data inserted successfully.")

except Exception as e: # Catch any exceptions
    connection.rollback() # Rollback the transaction if error occurs
    print("Error inserting data:")
    print(str(e))

finally:
    cursor.close()
    connection.close()