import json
import re

# Function to convert height from feet and inches to meters
def convert_height_to_meters(height):
  match = re.match(r"(\d+)'(\d{2})\"", height)
  if match:
    feet = int(match.group(1))
    inches = int(match.group(2))
    total_inches = feet * 12 + inches
    meters = total_inches * 0.0254
    return round(meters, 2)
  else:
    return height

# Read the file
with open('card/crewData.json', 'r') as f:
  crew_data = json.load(f)

# Convert the "height" property for each object
for crewmate in crew_data:
  if 'height' in crewmate:
    crewmate['height'] = convert_height_to_meters(crewmate['height'])

# Write the modified data back to the file
with open('card/crewData.json', 'w') as f:
  json.dump(crew_data, f, indent=2)