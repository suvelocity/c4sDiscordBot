"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.name = exports.run = void 0;
const run = (client, message) => {
    const formattedCommand = [...client.commands.values()]
        .map(({ name, description }) => `**${name}** => ${description}`)
        .join('\n');
    message.reply(`Here is all the available commands:\n${formattedCommand}`);
};
exports.run = run;
exports.name = 'guide';
exports.description = 'list all available commands';
