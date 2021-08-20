import { IEventFunction } from '../../types'
import { PREFIX } from '../../utils'

export const run: IEventFunction = async (client) => {
  client.logger.success('bot is ready 🔥🤖')
  client.user?.setPresence({
    activities: [
      {
        name: `Use ${PREFIX}guild`,
      },
    ],
  })
}

export const name: string = 'ready'
