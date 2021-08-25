"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = exports.run = void 0;
const utils_1 = require("../../utils");
const run = (client, message) => {
    if (!utils_1.isMsgValidCommand(message))
        return;
    const { command, args } = utils_1.getCommandArgs(message);
    const botCommand = client.commands.get(command);
    if (!botCommand)
        return;
    try {
        botCommand.run(client, message, args);
    }
    catch ({ message: errMsg }) {
        if (errMsg) {
            client.logger.error(`Error in command ${command}: ${errMsg}`);
        }
        message.channel.send(client.embed({ description: `Error running command ${command}` }, message));
    }
};
exports.run = run;
exports.name = 'messageCreate';
