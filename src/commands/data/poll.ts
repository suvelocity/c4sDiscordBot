import { MessageEmbed } from 'discord.js'
import { ICommandFunction, IPollOptions } from '../../types'
import { isAdmin } from '../../utils'

export const run: ICommandFunction = async (client, message, args) => {
  if (!isAdmin(message)) {
    message.reply('Not authorized')
    return
  }

  if (!args.length) {
    message.reply('Please specify question')
    return
  }
  const opts: IPollOptions = {
    options: ['👍', '👎'],
    timeout: 0,
    question: '',
  }
  const allArgs = args.join(' ')
  if (allArgs.includes('-T=')) {
    const timeout = args.find((opt) => opt.startsWith('-T='))?.substr(3)
    if (timeout) opts.timeout = +timeout
  }
  if (allArgs.includes('-O=')) {
    const description = args.find((arg) => arg.startsWith('-O='))?.substr(3)
    if (description) {
      opts.description = description
        .split(',')
        .map((o) => o.trim())
        .filter((o) => !!o.length)
    }
  }
  opts.question = args
    .filter((arg) => !arg.startsWith('-T=') && !arg.startsWith('-O='))
    .join(' ')
    .trim()

  const embed = new MessageEmbed({
    title: 'New poll 🙋📉',
    description: opts.question,
  }).setFooter(`${message.author.username} created new poll`)

  const poll = await message.channel.send({ embeds: [embed] })
  poll.pin()

  const reactionCollector = poll.createReactionCollector({
    filter: (reaction, user) => !!reaction.emoji.name && !!opts.options?.includes(reaction.emoji.name) && !user.bot,
    time: opts.timeout === 0 ? undefined : opts.timeout * 1000,
  })
  console.log(reactionCollector)

  opts.options!.forEach((emoji) => poll.react(emoji))
}

export const name = 'poll'
export const description =
  'create a poll in the chat, administrator permission required, usage: !poll <question> T=<timeout> O=<options? separated by commas>'
