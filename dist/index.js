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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const src_1 = require("./src");
// eslint-disable-next-line import/no-extraneous-dependencies
global.fetch = require('node-fetch');
require('dotenv').config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const bot = new src_1.Bot();
    bot.start({ token: process.env.BOT_TOKEN });
});
const keepAwake = () => {
    try {
        fetch('https://discordc4sbot.herokuapp.com/');
        console.log('keep awake');
    }
    catch ({ message }) {
        console.log(message);
    }
};
setInterval(keepAwake, 1000 * 60 * 15);
main();
const server = http_1.default.createServer((req, res) => {
    res.end('hello', 'utf-8');
});
server.listen(process.env.PORT || 8080);
