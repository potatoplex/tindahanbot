import { GuildMember, Message } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import MessageService from '../../services/MessageService';
import { AsyncCommandRunType } from '../../typings';
import { createEmbedMessage, mentionAuthor } from '../../util/MessageUtil';

type ArgType = {
	size: number;
};

const MAX_HISTORY = 5;

export default class SnipeCommand extends BaseCommand {
	lastUse: Map<string, Date>;
	constructor(client: CommandoClient) {
		super(client, {
			name: 'snipe',
			memberName: 'snipe',
			aliases: ['brrt'],
			group: CommandGroup.FUN.name,
			description: 'Show recently deleted message in channel',
			args: [
				{
					key: 'size',
					prompt: 'ILAN BABARELEN MO MAMIII?',
					type: 'integer',
					default: 1,
					parse: (value: number) =>
						value > MAX_HISTORY ? MAX_HISTORY : value,
				},
			],
		});

		this.lastUse = new Map();
	}

	async run(
		message: CommandoMessage,
		{ size }: ArgType
	): AsyncCommandRunType {
		const lastUseTime = this.lastUse.get(message.channel.id);
		if (lastUseTime) {
			const THROTTLE_DURATION = 15;
			const lastUseDiff =
				(new Date().getTime() - lastUseTime.getTime()) / 1000;
			if (lastUseDiff < THROTTLE_DURATION) {
				return message.say(
					`${mentionAuthor(
						message
					)}, You may not use the \`snipe\` command again for another ${(
						THROTTLE_DURATION - lastUseDiff
					).toFixed(2)} seconds.`
				);
			}
		}

		const messages = await MessageService.getDeletedMessages(
			message.channel.id,
			size
		);
		const expiration = 180;

		if (messages.length) {
			const endTime = new Date();
			const spiels = messages
				.filter(({ createdAt }) => {
					const startTime = new Date(createdAt);

					const timeDiff =
						(endTime.getTime() - startTime.getTime()) / 1000;
					const seconds = Math.round(timeDiff);
					return seconds <= expiration;
				})
				.map(({ user: authorID, content, createdAt }) => {
					const member = message.guild.member(
						authorID
					) as GuildMember;
					const { displayName: nickname, user } = member;
					const { username } = user;
					const avatar = user.displayAvatarURL({ format: 'png' });
					return createEmbedMessage('#0099ff')
						.setAuthor(nickname || username, avatar)
						.setDescription(content)
						.setTimestamp(+createdAt);
				});

			if (spiels.length > 0) {
				const messages = spiels.map(
					(m) => (message.say(m) as unknown) as Message
				);
				this.lastUse.set(message.channel.id, new Date());
				return Promise.all(messages);
			}
		}

		return message.say(
			createEmbedMessage('#0099ff').setAuthor("There's nothing to snipe!")
		);
	}
}
