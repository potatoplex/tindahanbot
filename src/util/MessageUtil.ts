import {
  Client,
  ColorResolvable,
  GuildEmoji,
  Message,
  MessageEmbed,
  Snowflake,
  User,
} from "discord.js";

export function bold(str: string): string {
  return `**${str}**`;
}

export function italic(str: string): string {
  return `*${str}*`;
}

export function underline(str: string): string {
  return `__${str}__`;
}

export function strike(str: string): string {
  return `~~${str}~~`;
}

export function spoiler(str: string): string {
  return `||${str}||`;
}

export function code(str: string): string {
  return "`" + str + "`";
}

export function mentionAuthor({ author }: Message): string {
  return mentionUser(author);
}

export function mentionUser(user: User | Snowflake | string): string {
  if (user instanceof User) return `<@${user.id}>`;
  return `<@${user}>`;
}

export function createEmbedMessage(
  color: ColorResolvable = "#0099ff",
  title?: string
): MessageEmbed {
  return new MessageEmbed({ color, title });
}

export function repeatMessage<T>(
  message: string | T,
  quantity = 3,
  delimiter = " "
): string {
  return Array(quantity)
    .fill(undefined)
    .map(() => message)
    .join(delimiter);
}

export function getEmoji(
  client: Client,
  emojiName: string,
  fallback: string | GuildEmoji = ""
): GuildEmoji | string {
  return (
    client.emojis.cache.find((emoji) => emoji.name === emojiName) || fallback
  );
}

export async function delay(ms = 500): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}
