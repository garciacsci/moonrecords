# insertEffects.py
from util import load_and_validate_json, connect_to_db, get_card_name_by_id, find_card_id_by_name

effect_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "effect_type": {"type": "string"},
            "effect_value_numeric": {"type": ["integer", "null"]},
            "effect_value_text": {"type": ["string", "null"]},
            "is_variable_effect_value": {"type": "boolean"},
            "referenced_card_id": {"type": ["integer", "null"]},
            "info": {"type": "string"}
        },
        "required": ["id", "effect_type", "is_variable_effect_value", "info"]
    }
}

# Load effect data
effect_data = load_and_validate_json('mechanic/effectData.json', effect_schema)

# Connect to the database
connection = connect_to_db()

try:
    cursor = connection.cursor()  # Create cursor object

    # Insert the data into the effect table
    for effect in effect_data:
        referenced_card_id = None
        if effect["referenced_card_id"] is not None:
            # Fetch the corresponding card name from actionCardsData.json by its id
            card_name = get_card_name_by_id('card/actionCardsData.json', effect["referenced_card_id"])
            # Find this card's id in the database
            referenced_card_id = find_card_id_by_name(cursor, card_name)

        # Prepare data for insertion
        effect_values = (
            effect['effect_type'],
            effect.get('effect_value_numeric'),
            effect.get('effect_value_text'),
            effect['is_variable_effect_value'],
            referenced_card_id,
            effect['info']
        )

        # Insert effect into the database
        cursor.execute("""
            INSERT INTO effect (effect_type, effect_value_numeric, effect_value_text, 
                is_variable_effect_value, referenced_card_id, info)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, effect_values)

        # Commit each insertion
        connection.commit()
        print(f"Effect {effect['effect_type']} inserted successfully.")

except Exception as e:
    connection.rollback()  # Roll back the transaction if an error occurred
    print("Error inserting data into the database.")
    print(str(e))

finally:
    cursor.close()
    connection.close()
    print("Data inserted successfully.")