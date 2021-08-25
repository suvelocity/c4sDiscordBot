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
exports.name = exports.run = void 0;
const utils_1 = require("../../utils");
const run = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    client.logger.success('bot is ready 🔥🤖');
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        activities: [
            {
                name: `Use ${utils_1.PREFIX}guild`,
            },
        ],
    });
});
exports.run = run;
exports.name = 'ready';
