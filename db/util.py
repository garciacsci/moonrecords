import json
import psycopg2
from jsonschema import validate
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
    except Exception as e:
        print("JSON data is invalid.")
        print(str(e))
        exit(1)

    return data

def connect_to_db():
    # Connect to the database
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )