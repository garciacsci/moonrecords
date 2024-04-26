import * as fs from 'fs';

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
      if (typeof value === 'string') {
        uniqueKeys[key].add(value);
      }
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
  console.log(`Unique keys and values in ${filename}:`);
  Object.entries(uniqueKeys).forEach(([key, values]) => {
    console.log(`Key: ${key}`);
    console.log(`Values: ${Array.from(values).join(', ')}`);
    console.log('---');
  });
  console.log('\n');
  fs.writeFileSync(`${filename}.uniqueKeys.json`, JSON.stringify(uniqueKeys, null, 2));
});