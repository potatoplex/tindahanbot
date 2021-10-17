import { Client as DClient, ClientOptions, Collection } from "discord.js";

export default class Client extends DClient {
  private _recents: Collection<string, any[]> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
  }

  public addRecents(key: string, value: any): void {
    const values = this._recents.get(key) || [];
    this._recents.set(key, values?.concat(value));
  }

  public getRecents(key: string): any[] {
    return this._recents.get(key) || [];
  }
  public setRecents(key: string, values: any[]): void {
    this._recents.set(key, values);
  }
}
