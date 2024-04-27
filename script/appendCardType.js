import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the file
const data = fs.readFileSync(path.join(__dirname, '../card/contractData.json'), 'utf-8');

// Parse the JSON
const contracts = JSON.parse(data);

// Append "cardType": "Ship Part" to every object
contracts.forEach(contract => {
  contract.cardType = 'Ship Part';
});

// Stringify the modified data
const modifiedData = JSON.stringify(contracts, null, 2);

// Write the modified data back to the file
fs.writeFileSync(path.join(__dirname, '../card/contractData.json'), modifiedData);