"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.name = exports.run = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const run = (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // if (!isAdmin(message)) { //TODO uncomment is admin restriction needed
    //   message.reply('Not authorized')
    //   return
    // }
    try {
        if (!args.length) {
            message.reply('Please specify question');
            return;
        }
        const allArgs = args.join(' ');
        if (!allArgs.includes(types_1.PollFlags.Options)) {
            message.reply('Please specify options');
            return;
        }
        const opts = {
            options: {},
            timeout: 0,
        };
        if (allArgs.includes(types_1.PollFlags.Timeout)) {
            const timeout = (_a = args.find((opt) => opt.startsWith(types_1.PollFlags.Timeout))) === null || _a === void 0 ? void 0 : _a.substr(3);
            if (timeout && +timeout)
                opts.timeout = +timeout;
        }
        const customOptions = (_b = args.find((arg) => arg.startsWith(types_1.PollFlags.Options))) === null || _b === void 0 ? void 0 : _b.substr(3);
        if (customOptions) {
            const formattedCustomOptions = customOptions.split(',').filter((o) => !!o.trim().length);
            if (formattedCustomOptions.length) {
                opts.options = {};
                formattedCustomOptions.forEach((o, i) => {
                    opts.options[i] = { votes: 0, option: o.trim() };
                    return null;
                });
            }
            else {
                message.reply('Please specify options correctly');
                return;
            }
        }
        opts.question = args
            .filter((arg) => !arg.startsWith(types_1.PollFlags.Timeout) && !arg.startsWith(types_1.PollFlags.Options))
            .join(' ')
            .trim();
        const embed = new discord_js_1.MessageEmbed({
            title: 'New poll 🙋📉',
        })
            .setFooter(`${message.author.username} created new poll`)
            .setDescription(`${opts.question}\n${Object.keys(opts.options)
            .map((key) => `${+key + 1}. ${opts.options[key].option}`)
            .join('\n')}`);
        const poll = yield message.channel.send({ embeds: [embed] });
        const reactionCollector = poll.createReactionCollector({
            filter: (reaction, user) => {
                const optsKeys = Object.keys(opts.options);
                if (!reaction.emoji.name || user.bot)
                    return false;
                return utils_1.defEmojiList.slice(0, optsKeys.length).includes(reaction.emoji.name);
            },
            time: !opts.timeout ? undefined : opts.timeout * 1000,
        });
        Object.keys(opts.options).forEach((emoji) => poll.react(utils_1.defEmojiList[+emoji]));
        const voterInfo = new Map();
        reactionCollector.on('collect', (reaction, user) => {
            if (!reaction.emoji.name)
                return;
            const optsKeys = Object.keys(opts.options);
            if (utils_1.defEmojiList.slice(0, optsKeys.length).includes(reaction.emoji.name)) {
                if (!voterInfo.has(user.id))
                    voterInfo.set(user.id, { emoji: reaction.emoji.name });
                const votedEmoji = voterInfo.get(user.id).emoji;
                const currEmojiRef = utils_1.defEmojiList.findIndex((e) => e === reaction.emoji.name).toString();
                if (votedEmoji !== reaction.emoji.name) {
                    const lastVote = poll.reactions.cache.get(votedEmoji);
                    if (lastVote === null || lastVote === void 0 ? void 0 : lastVote.count) {
                        lastVote.count -= 1;
                    }
                    lastVote === null || lastVote === void 0 ? void 0 : lastVote.users.remove(user.id);
                    const prevEmojiRef = utils_1.defEmojiList.findIndex((e) => e === votedEmoji).toString();
                    opts.options[prevEmojiRef].votes -= 1;
                    voterInfo.set(user.id, { emoji: reaction.emoji.name });
                }
                opts.options[currEmojiRef].votes += 1;
            }
        });
        reactionCollector.on('end', () => {
            const text = `*Ding! Ding! Ding! Time's up!\n Results are in,*\n\n${Object.keys(opts.options)
                .sort((key1, key2) => opts.options[key2].votes - opts.options[key1].votes)
                .map((key, i) => `${i + 1}. ${opts.options[key].option} - ${opts.options[key].votes}`)
                .join('\n')}`;
            poll.delete();
            message.channel.send({
                embeds: [
                    new discord_js_1.MessageEmbed({
                        title: `${opts.question}poll results  🙋📉`,
                    }).setDescription(text),
                ],
            });
        });
    }
    catch (error) {
        client.logger.error(error);
    }
});
exports.run = run;
exports.name = 'poll';
exports.description = 'create a poll in the chat, usage: !poll <question> T=<timeout (optional)> O=<options (optional) separated by commas>';
