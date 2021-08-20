import { ICommand, ICommandFunction } from '../../types'

export const run: ICommandFunction = (client, message) => {
  const formattedCommand = [...client.commands.values()]
    .map(({ name, description }: ICommand) => `**${name}** => ${description}`)
    .join('\n')
  message.reply(`Here is all the available commands:\n${formattedCommand}`)
}

export const name = 'guide'

export const description = 'list all available commands'
