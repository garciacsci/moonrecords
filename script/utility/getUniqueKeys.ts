import * as fs from 'fs';
import * as path from 'path';

interface UniqueKeys {
  [key: string]: Set<string>;
}

function processFile(filename: string): UniqueKeys {
  const fileContent = fs.readFileSync(filename, 'utf-8');
  const data = JSON.parse(fileContent);

  const uniqueKeys: UniqueKeys = {};

  data.forEach((item: any) => {
    Object.keys(item).forEach((key) => {
      if (!uniqueKeys[key]) {
        uniqueKeys[key] = new Set();
      }
      const value = item[key];
      //if (typeof value === 'string') {
        uniqueKeys[key].add(value);
      //}
    });
  });

  return uniqueKeys;
}

const filenames = [
  'card/actionCardsData.json',
  'card/contractData.json',
  'card/crewData.json',
  'card/shipPartsData.json',
  'card/objectiveData.json',
  'card/eventsData.json'
];



filenames.forEach((filename) => {
  const uniqueKeys = processFile(filename);
  let output: { filename: string; keys: { [key: string]: string[] } } = { filename: filename, keys: {} };

  Object.entries(uniqueKeys).forEach(([key, values]) => {
    output.keys[key] = Array.from(values);
  });

  console.log(output);

  const baseName = path.basename(filename, '.json');
  const newFilename = path.join('./script/uniqueKeys', `${baseName}.uniqueKeys.json`);

  fs.writeFileSync(newFilename, JSON.stringify(output, null, 2));
});