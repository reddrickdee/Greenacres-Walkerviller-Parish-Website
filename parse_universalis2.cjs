const fs = require('fs');
const content = fs.readFileSync('jsonpmass.js', 'utf8');
let jsonStr = content.substring(content.indexOf('(') + 1, content.lastIndexOf(')'));
const data = JSON.parse(jsonStr);
for (const key of Object.keys(data)) {
  if (data[key] && data[key].heading) {
    console.log(`\n--- ${key} ---`);
    console.log(JSON.stringify(data[key], null, 2).substring(0, 300) + '...');
  }
}
