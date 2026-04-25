const fs = require('fs');
const data = JSON.parse(fs.readFileSync('temp_step41.json', 'utf8'));
const targetContent = data.tool_calls[0].args.TargetContent;
fs.writeFileSync('recovered_content_final.txt', targetContent);
