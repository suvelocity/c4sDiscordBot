"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const consola_1 = __importDefault(require("consola"));
const discord_js_1 = require("discord.js");
const util_1 = require("util");
const glob_1 = __importDefault(require("glob"));
const promisedGlob = util_1.promisify(glob_1.default);
const customIntents = new discord_js_1.Intents();
customIntents.add(...Object.values(discord_js_1.Intents.FLAGS));
class Bot extends discord_js_1.Client {
    constructor() {
        super({ intents: customIntents });
        this.logger = consola_1.default;
        this.events = new discord_js_1.Collection();
        this.commands = new discord_js_1.Collection();
        this.config = {};
    }
    start(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = config;
            const commandsFiles = yield this.getFiles('commands');
            commandsFiles.forEach((val) => __awaiter(this, void 0, void 0, function* () {
                const file = yield Promise.resolve().then(() => __importStar(require(val)));
                this.commands.set(file.name, file);
            }));
            const eventsFiles = yield this.getFiles('events');
            eventsFiles.forEach((val) => __awaiter(this, void 0, void 0, function* () {
                const file = yield Promise.resolve().then(() => __importStar(require(val)));
                this.events.set(file.name, file);
                this.on(file.name, file.run.bind(null, this));
            }));
            const isConnectedSuccessfully = yield this.clientLogin();
            if (!isConnectedSuccessfully)
                return null;
        });
    }
    clientLogin() {
        const _super = Object.create(null, {
            login: { get: () => super.login }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.login.call(this, this.config.token);
                this.logger.success('bot connected successfully');
                return true;
            }
            catch ({ message }) {
                this.logger.error(message);
                return false;
            }
        });
    }
    getFiles(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield promisedGlob(`${__dirname}/${type}/**/*{.ts,.js}`);
                return files;
            }
            catch (e) {
                this.logger.error(`${type} files not found`);
                return [];
            }
        });
    }
    embed(options, message) {
        var _a;
        return {
            embeds: [
                new discord_js_1.MessageEmbed(Object.assign(Object.assign({}, options), { color: 'RANDOM' })).setFooter(`${message.author.tag}  | ${(_a = this.user) === null || _a === void 0 ? void 0 : _a.username}`, message.author.displayAvatarURL({ format: 'png', dynamic: true })),
            ],
        };
    }
}
exports.Bot = Bot;
