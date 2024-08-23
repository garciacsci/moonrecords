import json

filePath = 'card/actionCardsData.json'
property = 'card_type'
renamedProperty = 'action_card_type'

# Read the file
with open(filePath, 'r') as f:
  file = json.load(f)

# Remove the "requirements" property from each object
for object in file:
  if property in object:
    object[renamedProperty] = object.pop(property)

# Write the modified data back to the file
with open('card/actionCardsData.json', 'w') as f:
  json.dump(file, f, indent=2)