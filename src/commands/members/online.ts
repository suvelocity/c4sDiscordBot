import { ICommandFunction } from '../../types'

export const run: ICommandFunction = (client, message) => {
  const onlineCount = message.guild?.members.cache.reduce(
    (acc, curr) => acc + (curr.user.bot || curr.presence?.status !== 'online' ? 0 : 1),
    0
  )

  message.reply(`Total online members: ${onlineCount}`)
}

export const name = 'online'
export const description = 'count the total  online members'
