import { MessageEmbed } from 'discord.js'
import { ICommandFunction, IPollOptions, PollFlags } from '../../types'
import { defEmojiList } from '../../utils'

export const run: ICommandFunction = async (client, message, args) => {
  // if (!isAdmin(message)) { //TODO uncomment is admin restriction needed
  //   message.reply('Not authorized')
  //   return
  // }
  try {
    if (!args.length) {
      message.reply('Please specify question')
      return
    }
    const allArgs = args.join(' ')

    if (!allArgs.includes(PollFlags.Options)) {
      message.reply('Please specify options')
      return
    }
    const opts: Partial<IPollOptions> = {
      options: {},
      timeout: 0,
    }
    if (allArgs.includes(PollFlags.Timeout)) {
      const timeout = args.find((opt) => opt.startsWith(PollFlags.Timeout))?.substr(3)
      if (timeout && +timeout) opts.timeout = +timeout
    }

    const customOptions = args.find((arg) => arg.startsWith(PollFlags.Options))?.substr(3)
    if (customOptions) {
      const formattedCustomOptions = customOptions.split(',').filter((o) => !!o.trim().length)
      if (formattedCustomOptions.length) {
        opts.options = {}
        formattedCustomOptions.forEach((o, i) => {
          opts.options![i] = { votes: 0, option: o.trim() }
          return null
        })
      } else {
        message.reply('Please specify options correctly')
        return
      }
    }
    opts.question = args
      .filter((arg) => !arg.startsWith(PollFlags.Timeout) && !arg.startsWith(PollFlags.Options))
      .join(' ')
      .trim()

    const embed = new MessageEmbed({
      title: 'New poll 🙋📉',
    })
      .setFooter(`${message.author.username} created new poll`)
      .setDescription(
        `${opts.question}\n${Object.keys(opts.options!)
          .map((key) => `${+key + 1}. ${opts.options![key].option}`)
          .join('\n')}`
      )

    const poll = await message.channel.send({ embeds: [embed] })

    const reactionCollector = poll.createReactionCollector({
      filter: (reaction, user) => {
        const optsKeys = Object.keys(opts.options!)
        if (!reaction.emoji.name || user.bot) return false
        return defEmojiList.slice(0, optsKeys.length).includes(reaction.emoji.name)
      },
      time: !opts.timeout ? undefined : opts.timeout * 1000,
    })

    Object.keys(opts.options!).forEach((emoji) => poll.react(defEmojiList[+emoji]))
    const voterInfo = new Map()

    reactionCollector.on('collect', (reaction, user) => {
      if (!reaction.emoji.name) return
      const optsKeys = Object.keys(opts.options!)

      if (defEmojiList.slice(0, optsKeys.length).includes(reaction.emoji.name)) {
        if (!voterInfo.has(user.id)) voterInfo.set(user.id, { emoji: reaction.emoji.name })
        const votedEmoji = voterInfo.get(user.id).emoji
        const currEmojiRef = defEmojiList.findIndex((e) => e === reaction.emoji.name).toString()

        if (votedEmoji !== reaction.emoji.name) {
          const lastVote = poll.reactions.cache.get(votedEmoji)
          if (lastVote?.count) {
            lastVote.count -= 1
          }
          lastVote?.users.remove(user.id)
          const prevEmojiRef = defEmojiList.findIndex((e) => e === votedEmoji).toString()
          opts.options![prevEmojiRef].votes -= 1
          voterInfo.set(user.id, { emoji: reaction.emoji.name })
        }
        opts.options![currEmojiRef].votes += 1
      }
    })

    reactionCollector.on('end', () => {
      const text = `*Ding! Ding! Ding! Time's up!\n Results are in,*\n\n${Object.keys(opts.options!)
        .sort((key1, key2) => opts.options![key2].votes - opts.options![key1].votes)
        .map((key, i) => `${i + 1}. ${opts.options![key].option} - ${opts.options![key].votes}`)
        .join('\n')}`

      poll.delete()
      message.channel.send({
        embeds: [
          new MessageEmbed({
            title: `${opts.question}poll results  🙋📉`,
          }).setDescription(text),
        ],
      })
    })
  } catch (error) {
    client.logger.error(error)
  }
}

export const name = 'poll'
export const description =
  'create a poll in the chat, usage: !poll <question> T=<timeout (optional)> O=<options (optional) separated by commas>'
