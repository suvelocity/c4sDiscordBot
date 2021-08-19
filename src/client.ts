import consola, { Consola } from "consola";

import { Client, Intents, Collection } from "discord.js";
import { promisify } from "util";
import glob from "glob";
import { ICommand, IConfig, IEvent } from "./types";

const promisedGlob = promisify(glob);

const customIntents = new Intents();

customIntents.add(...Object.values(Intents.FLAGS));

export class Bot extends Client {
  public logger: Consola = consola;

  public events: Collection<string, IEvent> = new Collection();

  public commands: Collection<string, ICommand> = new Collection();

  private config: IConfig = {} as IConfig;

  constructor() {
    super({ intents: customIntents });
  }

  public async start(config: IConfig) {
    this.config = config;

    const commandsFiles = await this.getFiles("commands");
    commandsFiles.forEach(async (val: string) => {
      const file: ICommand = await import(val);
      this.commands.set(file.name, file);
    });
    const eventsFiles = await this.getFiles("events");

    eventsFiles.forEach(async (val: string) => {
      const file: IEvent = await import(val);
      this.events.set(file.name, file);
      this.on(file.name, file.run.bind(this));
    });

    const isConnectedSuccessfully = await this.clientLogin();
    if (!isConnectedSuccessfully) return null;
  }

  private async clientLogin(): Promise<boolean> {
    try {
      await super.login(this.config.token);
      this.logger.success("bot connected successfully");
      return true;
    } catch ({ message }) {
      this.logger.error(message);
      return false;
    }
  }

  private async getFiles(type: string): Promise<string[]> {
    try {
      const files = await promisedGlob(`${__dirname}/${type}/**/*{.ts,.js}`);
      return files;
    } catch (e) {
      this.logger.error(`${type} files not found`);
      return [];
    }
  }
}
