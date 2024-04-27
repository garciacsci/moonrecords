"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function processFile(filename) {
    var fileContent = fs.readFileSync(filename, 'utf-8');
    var data = JSON.parse(fileContent);
    var uniqueKeys = {};
    data.forEach(function (item) {
        Object.keys(item).forEach(function (key) {
            if (!uniqueKeys[key]) {
                uniqueKeys[key] = new Set();
            }
            var value = item[key];
            //if (typeof value === 'string') {
            uniqueKeys[key].add(value);
            //}
        });
    });
    return uniqueKeys;
}
var filenames = [
    'card/actionCardsData.json',
    'card/contractData.json',
    'card/crewData.json',
    'card/shipPartsData.json',
    'card/objectiveData.json',
    'card/eventsData.json'
];
filenames.forEach(function (filename) {
    var uniqueKeys = processFile(filename);
    var output = { filename: filename, keys: {} };
    Object.entries(uniqueKeys).forEach(function (_a) {
        var key = _a[0], values = _a[1];
        output.keys[key] = Array.from(values);
    });
    console.log(output);
    var baseName = path.basename(filename, '.json');
    var newFilename = path.join('./script/uniqueKeys', "".concat(baseName, ".uniqueKeys.json"));
    fs.writeFileSync(newFilename, JSON.stringify(output, null, 2));
});
