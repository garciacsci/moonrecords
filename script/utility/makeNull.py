import json

#filePath = 'card/contractData.json'
filePath = 'card/crewData.json'

def replace_empty_string_with_none(obj):
    if isinstance(obj, dict):
        return {k: replace_empty_string_with_none(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [replace_empty_string_with_none(elem) for elem in obj]
    elif obj == '':
        return None
    else:
        return obj

# Load the JSON data
with open(filePath, 'r') as f:
    data = json.load(f)

# Replace all empty strings with None
data = replace_empty_string_with_none(data)

# Write the modified data back to the file
with open(filePath, 'w') as f:
    json.dump(data, f, indent=2)