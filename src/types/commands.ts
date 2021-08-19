import { Message } from 'discord.js'
import { Bot } from '../client'

export interface ICommandFunction {
  (client: Bot, message: Message, arg: string[]): Promise<void> | void
}

export interface ICommand {
  run: ICommandFunction
  name: string
  category?: string
  description: string
}
