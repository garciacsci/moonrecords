import json

# Define the data to be added
data_to_add = {
    "play_as_id": 0,
    "interact_id": [
        {
            "id": None,
            "card_type": None,
            "block_hazard": 0,
            "block_hazard_die": 0,
            "negate_hazard": 0,
            "negate_hazard_die": 0,
            "roll_hazard_die": None,
            "roll_moonroller_die": 0,
            "gain_io": 0,
            "spend_io": 0,
            "faction_rep": 0,
            "prestiege": 0,
            "credit": 0,
            "allies": 0,
            "objective_card": 0,
            "armory": False
        }
    ],
    "requirements": [
        {
            "reactor": 0,
            "damage": 0,
            "thruster": 0,
            "shield": 0,
            "crew": 0,
            "flex": 0
        }
    ]
}

# List of files to update
files_to_update = ['card/crewData.json', 'card/shipPartsData.json']

# Loop over each file
for file_name in files_to_update:
    # Open the file with utf-8 encoding
    with open(file_name, 'r+', encoding='utf-8') as file:
        # Load the JSON data
        data = json.load(file)

        # Loop over each object in the data
        for obj in data:
            # Add the new data to the object
            obj.update(data_to_add)

        # Move the pointer to the beginning of the file
        file.seek(0)

        # Write the updated data back to the file
        json.dump(data, file, indent=4)

        # Truncate the file to remove any old data that might be left over
        file.truncate()