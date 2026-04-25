const fs = require('fs');
const data = JSON.parse(fs.readFileSync('temp_step41.json', 'utf8'));
const targetContent = data.tool_calls[0].args.TargetContent;
console.log(targetContent);
