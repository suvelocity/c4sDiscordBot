"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.getCommandArgs = exports.isMsgValidCommand = void 0;
const consts_util_1 = require("./consts.util");
const isMsgValidCommand = (msg) => !!msg && msg.content.toLowerCase().startsWith(consts_util_1.PREFIX) && !msg.author.bot && !!msg.guild;
exports.isMsgValidCommand = isMsgValidCommand;
const getCommandArgs = ({ content }) => {
    const msgWithoutPrefix = content.substr(1);
    const [command, ...args] = msgWithoutPrefix.split(' ');
    return {
        command,
        args,
    };
};
exports.getCommandArgs = getCommandArgs;
const isAdmin = (msg) => { var _a; return (_a = msg.member) === null || _a === void 0 ? void 0 : _a.permissions.has('ADMINISTRATOR'); };
exports.isAdmin = isAdmin;
