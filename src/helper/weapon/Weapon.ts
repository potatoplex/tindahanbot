import { GuildEmoji } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { getEmoji } from '../../util/MessageUtil';

type EmojiMap = { [key: string]: string };
type Emojis = { [key: string]: GuildEmoji | string };

export default abstract class Weapon {
	emojis: Emojis;
	client: CommandoClient;
	fallback: string;
	length: number;

	constructor(
		length: number,
		emojis: EmojiMap,
		fallback: string,
		client: CommandoClient
	) {
		this.length = length;
		this.fallback = fallback;
		this.emojis = Object.keys(emojis).reduce(
			(prev, next) => ({
				...prev,
				[next]: getEmoji(client, emojis[next], fallback),
			}),
			{}
		);
		this.client = client;
	}

	abstract render(): string;
}
