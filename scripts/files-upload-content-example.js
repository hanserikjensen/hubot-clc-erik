// Description:
//   Example of executing a child process and displaying the output using the files.upload method for Slack API with Hubot!
//
// Dependencies:
//   "hubot": "latest"
//   "node-slack-client": "latest"
//   "node-slack-upload": "latest"
//
// Configuration:
//   HUBOT_SLACK_BOTNAME - This is the Hubot's name as configured with the matching Slack API key
//   HUBOT_SLACK_TOKEN - This is the Hubot's Slack API token key
//
// Commands:
//   server info please
//
// Author:
//   Ernest G. Wilson II <Ernest.Wilson@ctl.io>

// In production turn OFF debugging!
var debug = true; // Controls debugging

// Require the child_process module so we can issue shell commands
var child_process = require('child_process');

// Export to the robot
module.exports = function (robot) {

    // verify that all of the needed environment variables are available to the bot
    var ensureConfig;
    ensureConfig = function () {
        if (!process.env.HUBOT_SLACK_BOTNAME) {
            throw new Error("Error: HUBOT_SLACK_BOTNAME environment variable is not set");
        }
        if (!process.env.HUBOT_SLACK_TOKEN) {
            throw new Error("Error: HUBOT_SLACK_TOKEN environment variable is not set");
        }
        return true;
    }
    ensureConfig();

    // Populate global variables based on environment variables
    var token = process.env.HUBOT_SLACK_TOKEN;

    // Listen to the ChatOps input coming from Slack and perform actions based on desired matching commands
    robot.respond(/server info (.*)/i, function(msg) {

        // Optional debug is helpful for trouble shooting
        if (debug === true){console.log("msg.envelope.user.name: " + msg.envelope.user.name);} // See value of msg.envelope.user.name
        if (debug === true){console.log("msg.envelope.user.id: " + msg.envelope.user.id);} // See value of msg.envelope.user.id
        if (debug === true){console.log("msg.message.room: " + msg.message.room);} // See value of msg.message.room
        
        // Logging
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}
        
        // Determine where to send the files.upload results
        var SendToChannel;
        if (msg.envelope.user.name === msg.message.room) {SendToChannel=msg.envelope.user.id;} // Send it to the human in a private response where they requested it
        else {SendToChannel=msg.message.room;} // Send it to the specific channel where the human sent the request from

        // Read the human's input
        var AllArguments = msg.match[0];
        var Arg = AllArguments.split(" ");
        // Argument debugging
        if (debug === true){console.log("AllArguments: " + AllArguments);} // See value of AllArguments
        if (debug === true){console.log("Arg0: " + Arg[0]);} // See value of Arg[0]
        if (debug === true){console.log("Arg1: " + Arg[1]);} // See value of Arg[1]
        if (debug === true){console.log("Arg2: " + Arg[2]);} // See value of Arg[2]
        if (debug === true){console.log("Arg3: " + Arg[3]);} // See value of Arg[3]
        if (debug === true){console.log("Arg4: " + Arg[4]);} // See value of Arg[4]

        // Did they say please?
        if (Arg[3] === "please") {

            // Reply to the human since they said please!
            msg.send("Just a moment please as I retrieve the current server details for you...");

            // Kick off a child process in this example and collect the output in three (3) variables: error, stdout, stderr
            child_process.exec("hostname; date; uptime; free; df -h; ifconfig -a; netstat -rn; uname -a", function(error, stdout, stderr) {

                // Display the output in Slack with an expandable/collapsable snippet text area
                // Uses: https://www.npmjs.com/package/node-slack-upload
                // REF: https://api.slack.com/methods/files.upload
                var Slack = require('node-slack-upload');
                var slack = new Slack(token);
                slack.uploadFile({
                    content: stdout, // This is the results of stdout from the child_process above
                    filetype: 'auto', // Possible file types are: https://api.slack.com/types/file#file_types
                    title: "@" + msg.envelope.user.name + ": Here is that output requested by @" + msg.envelope.user.name + " delivered by the files.upload method from stdout output",
                    initialComment: "Optional comment text can go here below the snippet!", // Comment this line out if a comment is not desired
                    channels: SendToChannel // Send the results back to where the command was issued, either a channel or private message
                }, function(err) {
                    if (err) {
                        console.error("files.upload error: " + err);
                    }
                });
                // Return via normal processing
                return;
            });

        }

    });
}; // Robot out