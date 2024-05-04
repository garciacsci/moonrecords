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