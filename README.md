hubot-clc-example
============

Use ChatOps (Slack) to have Hubot issue child process commands and display the output as a snippet


## Installation
```
npm install hubot-redis-brain --save
npm install hubot-clc-example --save
npm install node-slack-upload
```

## Configuration
Include `hubot-redis-brain` and `hubot-clc-example` and ensure these variables are in your /etc/systemd/system/chatops.service startup environment:
```
HUBOT_SLACK_BOTNAME=botnamegoeshere
HUBOT_SLACK_TOKEN=botslackapikeytokengoeshere
```
