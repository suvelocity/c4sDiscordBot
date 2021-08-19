import { Message } from 'discord.js'
import { IEventFunction } from '../../types'

export const run: IEventFunction = (client, message: Message) => {
  if (message.author.bot) return
}

export const name = 'messageCreate'
