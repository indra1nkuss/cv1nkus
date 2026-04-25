const fs = require('fs');
const data = JSON.parse(fs.readFileSync('temp_step185.json', 'utf8'));
const code = data.tool_calls[0].args.CodeContent;
fs.writeFileSync('recovered_script_185.txt', code);
