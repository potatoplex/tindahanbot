import { MessageEmbed } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import config from '../../config';
import CommandGroup from '../../enums/CommandGroup';
import DiscordApiService, { Member } from '../../services/DiscordApiService';
import { AsyncCommandRunType } from '../../typings';
import { createEmbedMessage, mentionUser } from '../../util/MessageUtil';

export default class InactiveTrackerCommand extends Command {
	discordApiService: DiscordApiService;
	constructor(client: CommandoClient) {
		super(client, {
			name: 'inactive',
			memberName: 'inactive',
			aliases: ['inac'],
			group: CommandGroup.MOD.name,
			description: 'List Inactive Members',
			throttling: {
				usages: 2,
				duration: 5,
			},
		});
		this.discordApiService = new DiscordApiService();
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		const { baseRole = '', activityRoles = [] } = config.commands.inactive;

		const members = await this.discordApiService.getMembersByRoleId(
			message.guild.id,
			baseRole
		);

		const inactive = members.filter(
			({ roles }) => !roles.some((role) => activityRoles.includes(role))
		);

		const out = inactive
			.map((m: Member) => mentionUser(m.user.id))
			.join('\n');
		const embed = createEmbedMessage()
			.setTitle(`Inactive Users (${inactive.length})`)
			.setDescription(inactive.length > 0 ? out : 'None');

		return message.say(embed);
	}
}
