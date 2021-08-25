import { Bot } from './src'

// eslint-disable-next-line import/no-extraneous-dependencies
global.fetch = require('node-fetch')

require('dotenv').config()

const main = async () => {
  const bot = new Bot()
  bot.start({ token: process.env.BOT_TOKEN! })
}

const keepAwake = () => {
  try {
    fetch('https://discordc4sbot.herokuapp.com/')
    console.log('keep awake')
  } catch ({ message }) {
    console.log(message)
  }
}

setInterval(keepAwake, 1000 * 60 * 15)

main()
