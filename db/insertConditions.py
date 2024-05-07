from util import load_and_validate_json, connect_to_db, get_card_name_by_id, find_card_id_by_name

condition_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "condition_type": {"type": "string"},
            "condition_value_numeric": {"type": ["integer", "null"]},
            "condition_value_text": {"type": ["string", "null"]},
            "is_variable_condition_value": {"type": "boolean"},
            "referenced_card_id": {"type": ["integer", "null"]},
            "info": {"type": "string"}
        },
        "required": [
            "id",
            "condition_type",
            "is_variable_condition_value",
            "info"
        ]
    }
}


# Load condition data
condition_data = load_and_validate_json('mechanic/conditionData.json', condition_schema)

# Connect to the database
connection = connect_to_db()

try:
    cursor = connection.cursor()  # Create cursor object

    # Insert the data into the condition table
    for condition in condition_data:
        referenced_card_id = None
        if condition["referenced_card_id"] is not None:
            # Fetch the corresponding card name from actionCardsData.json by its id
            card_name = get_card_name_by_id('card/actionCardsData.json', condition["referenced_card_id"])
            # Find this card's id in the database
            referenced_card_id = find_card_id_by_name(cursor, card_name)

        # Prepare data for insertion
        condition_values = (
            condition['condition_type'],
            condition.get('condition_value_numeric'),
            condition.get('condition_value_text'),
            condition['is_variable_condition_value'],
            referenced_card_id,
            condition['info']
        )

        # Insert condition into the database
        cursor.execute("""
            INSERT INTO condition (condition_type, condition_value_numeric, condition_value_text, 
                is_variable_condition_value, referenced_card_id, info)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, condition_values)

        # Commit each insertion
        connection.commit()
        print(f"Condition {condition['condition_type']} inserted successfully.")

except Exception as e:
    connection.rollback()  # Roll back the transaction if an error occurred
    print("Error inserting data into the database.")
    print(str(e))

finally:
    cursor.close()
    connection.close()
    print('Data inserted successfully.')