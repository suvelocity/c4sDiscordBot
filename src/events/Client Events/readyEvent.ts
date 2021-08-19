import { IEventFunction } from '../../types'

export const run: IEventFunction = async (client) => {
  client.logger.success('bot is ready 🔥🤖')
}

export const name: string = 'ready'
