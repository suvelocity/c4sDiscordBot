export interface IInteraction {
  option: string | number
  votes: number
}

export type InteractionsCollection = Record<string, IInteraction>
export interface IPollOptions {
  timeout: number
  question: string
  options: InteractionsCollection
  description?: string[]
}

export enum PollFlags {
  Timeout = '-T=',
  Options = '-O=',
}
