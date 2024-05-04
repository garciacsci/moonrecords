import json

filePath = 'card/contractData.json'

def remove_contract_from_type(obj):
  if isinstance(obj, dict):
    for k, v in obj.items():
      if k == 'type':
        obj[k] = v.replace('_contract', '')
      else:
        remove_contract_from_type(v)
  elif isinstance(obj, list):
    for item in obj:
      remove_contract_from_type(item)

# Load the JSON data
with open(filePath, 'r') as f:
  data = json.load(f)

# Remove '_contract' from 'type' entries
remove_contract_from_type(data)

# Write the modified data back to the file
with open(filePath, 'w') as f:
  json.dump(data, f, indent=2)