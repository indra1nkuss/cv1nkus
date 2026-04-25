import json

with open('temp_step41.json', 'r') as f:
    data = json.load(f)
    target_content = data['tool_calls'][0]['args']['TargetContent']
    print(target_content)
