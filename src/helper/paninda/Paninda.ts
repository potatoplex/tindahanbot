import {
  GuildMember,
  InteractionReplyOptions,
  MessageEmbed,
  User,
} from "discord.js";
import { bold, mentionUser } from "../../util/MessageUtil";

export default abstract class Paninda {
  name: string;
  aliases: string[];
  price: number;
  succeRate: number;
  constructor(
    name: string,
    aliases: string[],
    price: number,
    successRate: number
  ) {
    this.name = name;
    this.aliases = aliases;
    this.price = price;
    this.succeRate = successRate;
  }

  abstract successSpiel: (
    _user: User,
    _member: GuildMember
  ) => Promise<string | MessageEmbed | InteractionReplyOptions> | string;

  failSpiel = (user: User): string => {
    return `Hindi nakabili si ${mentionUser(user)} ${bold(
      this.name.toUpperCase()
    )} kasi out of stock. Pasensya ka na ha. God Bless.`;
  };
}
