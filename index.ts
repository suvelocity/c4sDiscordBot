import { Bot } from './src';

require('dotenv').config();

const main = async () => {
  const bot = new Bot();
  bot.start({ token: process.env.BOT_TOKEN! });
};

main();
