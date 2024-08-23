from util import load_and_validate_json, connect_to_db

event_card_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "type": {"type": "string"},
            "collection": {"type": "string"},
            "image": {"type": "string"},
            "cardText": {"type": "string"}
        },
        "required": ["id", "name", "type", "collection", "image", "cardText"]
    }
}

# Load and validate JSON
event_data = load_and_validate_json('card/eventsData.json', event_card_schema)

# Connect to the database
connection = connect_to_db()

# Insert Data
try:
  cursor = connection.cursor() #create cursor object

  # Insert the data into the card table
  for card in event_data:
      cursor.execute("""
          INSERT INTO card(name, collection, image, card_text)
          VALUES(%s, %s, %s, %s)
          RETURNING id
      """, (card['name'], card['collection'], card['image'], card['cardText']))

      card_id = cursor.fetchone()[0]

      # Insert the data into the event_card table
      cursor.execute("""
          INSERT INTO event(id, type)
          VALUES(%s, %s)
      """, (card_id, card['type']))

      # Commit changes
      connection.commit()
      print("Data inserted successfully.")

except Exception as e:
    connection.rollback() # Rollback the transaction if an error occurred
    print("Error inserting data into the database.")
    print(str(e))

finally:
    cursor.close()
    connection.close()