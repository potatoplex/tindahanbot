import { GuildChannel, User } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import DiscordApiService from '../../services/DiscordApiService';
import { AsyncCommandRunType } from '../../typings';
import { delay, repeatMessage } from '../../util/MessageUtil';
import { doRollRange } from '../../util/RngUtil';

export default class SunogCommand extends BaseCommand {
	discordApiService: DiscordApiService;
	constructor(client: CommandoClient) {
		super(client, {
			name: 'sunog',
			memberName: 'sunog',
			group: CommandGroup.FUN.name,
			args: [
				{
					key: 'targets',
					prompt: 'Ano/Sino sosonogen?',
					type: 'channel|user',

					infinite: true,
				},
			],
			description: 'Sonogen',
			throttling: {
				usages: 2,
				duration: 5,
			},
			userPermissions: ['MANAGE_CHANNELS'],
		});

		this.discordApiService = new DiscordApiService();
	}

	async run(
		message: CommandoMessage,
		{ targets }: { targets: (GuildChannel | User)[] }
	): AsyncCommandRunType {
		for (const target of targets) {
			const msg = repeatMessage('🔥', doRollRange(1, 7), '');
			if (target instanceof GuildChannel) {
				await this.discordApiService.updateChannel(target.id, {
					name: msg,
				});
			}

			if (target instanceof User) {
				const member = message.guild.member(target);
				await member?.setNickname(msg);
			}
			delay(1000);
		}

		return message.say('sunog!');
	}
}
