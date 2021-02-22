import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import config from '../../config';
import CommandGroup from '../../enums/CommandGroup';
import DiscordApiService from '../../services/DiscordApiService';
import { AsyncCommandRunType } from '../../typings';
import { mentionAuthor } from '../../util/MessageUtil';

export default class LimitedInviteCommand extends Command {
	discordApiService: DiscordApiService;
	constructor(client: CommandoClient) {
		super(client, {
			name: 'invite',
			memberName: 'invite',
			aliases: ['inv'],
			group: CommandGroup.UTILITY.name,
			description: 'Invite a user',
			throttling: {
				usages: 2,
				duration: 5,
			},
		});
		this.discordApiService = new DiscordApiService();
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		const inviteChannel = message.guild.channels.cache.find(
			(channel) => channel.id === config.inviteChannel
		);

		if (inviteChannel) {
			const invite = await inviteChannel.createInvite({
				maxAge: 60 * 60,
				temporary: true,
				unique: true,
			});
			return message.author.send(
				`Hello ${mentionAuthor(
					message
				)}, send this link to the person you wish to invite to the server: \n${
					invite.url
				}`
			);
		}

		return null;
	}
}
