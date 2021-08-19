import { Message } from 'discord.js'
import { ICommand, IEventFunction, Maybe } from '../../types'
import { getCommandArgs, isMsgValidCommand } from '../../utils'

export const run: IEventFunction = (client, message: Message) => {
  if (!isMsgValidCommand(message)) return
  const { command, args } = getCommandArgs(message)
  const botCommand: Maybe<ICommand> = client.commands.get(command)
  if (!botCommand) return
  try {
    botCommand!.run(client, message, args)
  } catch ({ message: errMsg }) {
    if (errMsg) {
      client.logger.error(`Error in command ${command}: ${errMsg}`)
    }
    message.channel.send(client.embed({ description: `Error running command ${command}` }, message) as any)
  }
}

export const name = 'messageCreate'
