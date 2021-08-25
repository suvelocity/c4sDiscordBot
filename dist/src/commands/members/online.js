"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.name = exports.run = void 0;
const run = (client, message) => {
    var _a;
    const onlineCount = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.reduce((acc, curr) => { var _a; return acc + (curr.user.bot || ((_a = curr.presence) === null || _a === void 0 ? void 0 : _a.status) !== 'online' ? 0 : 1); }, 0);
    message.reply(`Total online members: ${onlineCount}`);
};
exports.run = run;
exports.name = 'online';
exports.description = 'count the total  online members';
