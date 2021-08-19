import { Bot } from '../client'

export interface IEventFunction {
  (client: Bot, ...args: any[]): Promise<void> | void
}

export interface IEvent {
  run: IEventFunction
  name: string
  category?: string
}
