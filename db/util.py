import json
import psycopg2
from jsonschema import ValidationError, validate
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def load_and_validate_json(filename, schema):
    # Read the JSON file
    with open(filename) as file:
        data = json.load(file)

# Validate the JSON data against the schema
    try:
        validate(instance=data, schema=schema)
        print("JSON data is valid.")
    except ValidationError as ve:
        # Provide a detailed error message
        print("JSON data is invalid.")
        print(f"Validation error in {ve.path}: {ve.message}")
        exit(1)
    except json.JSONDecodeError as je:
        # Specific error if JSON is malformed
        print(f"Error reading JSON file: {je.msg}")
        exit(1)
    except Exception as e:
        # Catch-all for any other exceptions that may occur
        print("An unexpected error occurred:")
        print(str(e))
        exit(1)

    return data

    return data

def connect_to_db():
    # Connect to the database
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )

def get_card_name_by_id(json_filename, card_id):
    """ Retrieve a card name from JSON data based on its id. """
    # TODO: Make validation a function call based on filename
    # cards = load_and_validate_json(json_filename)
    with open(json_filename, 'r') as file:
      cards = json.load(file)
    for card in cards:
        if card['id'] == card_id:            
            return card['name']
    return None

def find_card_id_by_name(cursor, card_name):
    """ Fetch the card ID from the database by card name. """
    cursor.execute("SELECT id FROM card WHERE name = %s", (card_name,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        return None