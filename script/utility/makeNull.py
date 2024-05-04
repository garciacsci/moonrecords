filePath = 'card/contractData.json'
import json

def replace_empty_string_with_none(obj):
  if isinstance(obj, dict):
    return {k: replace_empty_string_with_none(v) if k != 'factionRep' else (None if v == '' else v) for k, v in obj.items()}
  elif isinstance(obj, list):
    return [replace_empty_string_with_none(elem) for elem in obj]
  else:
    return obj

# Load the JSON data
with open(filePath, 'r') as f:
  data = json.load(f)

# Replace all empty strings with None for 'faction_rep' key
data = replace_empty_string_with_none(data)

# Write the modified data back to the file
with open(filePath, 'w') as f:
  json.dump(data, f, indent=2)