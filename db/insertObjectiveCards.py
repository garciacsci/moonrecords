# insertObjectiveCards.py
from util import load_and_validate_json, connect_to_db

objective_card_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "collection": {"type": "string"},
            "image": {"type": "string"},
            "prestige": {"type": "integer"},
            "cardText": {"type": "string"}
        },
        "required": ["id", "name", "collection", "image", "prestige", "cardText"]
    }
}

# Load and validate JSON
objective_data = load_and_validate_json('card/objectiveData.json', objective_card_schema)

# Connect to the database
connection = connect_to_db()

# Insert Data
try:
    cursor = connection.cursor()  # Create cursor object

    # Insert the data into the card table
    for card in objective_data:
        cursor.execute("""
            INSERT INTO card (name, collection, image, card_text)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """, (card['name'], card['collection'], card['image'], card['cardText']))
        
        card_id = cursor.fetchone()[0]

        # Insert the data into the objective table
        cursor.execute("""
            INSERT INTO objective (id, prestiege)
            VALUES (%s, %s)
        """, (card_id, card['prestige']))

        # Commit changes
        connection.commit()
        print(f"Data for card {card['name']} inserted successfully.")

except Exception as e:
    connection.rollback()  # Roll back the transaction if an error occurred
    print("Error inserting data into the database.")
    print(str(e))

finally:
    cursor.close()
    connection.close()
