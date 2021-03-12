/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import {
	Command,
	CommandInfo,
	CommandoClient,
	CommandoMessage,
} from 'discord.js-commando';
import { CommandRunType } from '../typings';
import { mentionAuthor } from '../util/MessageUtil';
import { getRandomColor } from '../util/RngUtil';
import BaseCommand from './BaseCommand';

export default class AnnounceCommand extends BaseCommand {
	embed: Partial<MessageEmbedOptions>;
	randomColor = true;
	isReply = false;

	constructor(
		client: CommandoClient,
		info: CommandInfo,
		embed: Partial<MessageEmbedOptions> = {},
		isReply = false
	) {
		super(client, info);
		this.isReply = isReply;
		this.embed = embed;
	}

	run(
		message: CommandoMessage,
		// eslint-disable-next-line no-unused-vars
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// eslint-disable-next-line @typescript-eslint/ban-types
		_args: object | string | string[] = {}
	): CommandRunType {
		if (this.randomColor) {
			this.embed = { ...this.embed, color: getRandomColor() };
		}

		if (this.isReply && this.embed.description) {
			this.embed.description = `${mentionAuthor(message)}, ${
				this.embed.description
			}`;
		}
		return message.embed(new MessageEmbed(this.embed));
	}
}
