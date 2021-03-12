/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GuildEmoji, Message } from 'discord.js';
import {
	ArgumentCollectorResult,
	Command,
	CommandoMessage,
} from 'discord.js-commando';
import { getEmoji } from '../util/MessageUtil';

export default abstract class BaseCommand extends Command {
	public abstract run(
		message: CommandoMessage,
		args: string | object | string[],
		fromPattern: boolean,
		result?: ArgumentCollectorResult<object>
	): Promise<Message | Message[] | null> | null;

	getEmoji(
		emojiName: string,
		fallback: string | GuildEmoji = ''
	): GuildEmoji | string {
		return getEmoji(this.client, emojiName, fallback);
	}
}
