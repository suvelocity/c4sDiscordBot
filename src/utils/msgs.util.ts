import { Message } from 'discord.js'
import { PREFIX } from './consts.util'

export const isMsgValidCommand = (msg: Message) =>
  !!msg && msg.content.toLowerCase().startsWith(PREFIX) && !msg.author.bot && !!msg.guild

export const getCommandArgs = ({ content }: Message) => {
  const msgWithoutPrefix = content.substr(1)
  const [command, ...args] = msgWithoutPrefix.split(' ')
  return {
    command,
    args,
  }
}

export const isAdmin = (msg: Message) => msg.member?.permissions.has('ADMINISTRATOR')
