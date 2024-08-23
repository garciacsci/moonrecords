import os
import json

# Function to convert string to snake case
def to_snake_case(s):
  return s.lower().replace(' ', '_')

# Directory containing the JSON files
directory = 'card'

# Process each file in the directory
for filename in os.listdir(directory):
  # Only process JSON files
  if filename.endswith('.json'):
    filepath = os.path.join(directory, filename)

    # Read the file
    with open(filepath, 'r') as f:
      data = json.load(f)

    # Convert the "collection" property to snake case for each object
    for object in data:
      if 'collection' in object:
        object['collection'] = to_snake_case(object['collection'])
      if 'faction' in object:
        object['faction'] = to_snake_case(object['faction'])
      if 'role' in object:
        object['role'] = to_snake_case(object['role'])
      if 'sector' in object:
        object['sector'] = to_snake_case(object['sector'])

      if filename == 'contractData.json':
        if 'type' in object:
          object['type'] = to_snake_case(object['type'])
      if filename == 'crewData.json':
        if 'type' in object:
          object['type'] = to_snake_case(object['type'])
      if filename == 'eventsData.json':
        if 'type' in object:
          object['type'] = to_snake_case(object['type'])

    # Write the modified data back to the file
    with open(filepath, 'w') as f:
      json.dump(data, f, indent=2)