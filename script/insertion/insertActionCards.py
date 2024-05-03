import json
import psycopg2
from jsonschema import validate

# JSON schema for validation
action_card_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "collection": {"type": "string"},
            "image": {"type": "string"},
            "cardText": {"type": "string"},
            "cardType": {"type": "string"},
            "is_discrete": {"type": "boolean"}
        },
        "required": ["id", "name", "collection", "image", "cardText", "cardType", "is_discrete"]
    }
}

# Read the JSON file
with open('card/actionCardsData.json') as file:
    action_cards_data = json.load(file)

# Validate the JSON data against the schema
try:
    validate(instance=action_cards_data, schema=action_card_schema)
    print("JSON data is valid.")
except Exception as e:
    print("JSON data is invalid.")
    print(str(e))
    exit(1)

# Connect to the PostgreSQL database
conn = psycopg2.connect(
    host="localhost",
    database="moonrecords",
    user="mars",
    password=""
)

try:
    # Create a cursor object
    cur = conn.cursor()

    # Insert the data into the action_card table
    for card in action_cards_data:
        # Insert card into card table
        cur.execute("""
            INSERT INTO card (id, name, collection, image, card_text)
            VALUES (%s, %s, %s, %s, %s)
        """, (card['id'], card['name'], card['collection'], card['image'], card['cardText']))

        # Then insert into action_card table
        cur.execute("""
            INSERT INTO action_card (id, action_card_type, is_discrete)
            VALUES (%s, %s, %s)
        """, (card['id'], card['cardType'], card['is_discrete']))
        

    # Commit the changes
    conn.commit()
    print("Data inserted successfully.")

except Exception as e:
    # Roll back the transaction if an error occurs
    conn.rollback()
    print("Error inserting data:")
    print(str(e))

finally:
    # Close the cursor and the database connection
    cur.close()
    conn.close()