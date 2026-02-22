const fs = require('fs');
const content = fs.readFileSync('jsonpmass.js', 'utf8');
let jsonStr = content.substring(content.indexOf('(') + 1, content.lastIndexOf(')'));
const data = JSON.parse(jsonStr);
console.log(JSON.stringify(Object.keys(data), null, 2));
