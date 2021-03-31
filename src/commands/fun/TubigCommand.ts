import { GuildChannel, User } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import DiscordApiService from '../../services/DiscordApiService';
import { AsyncCommandRunType } from '../../typings';

export default class SunogCommand extends BaseCommand {
	discordApiService: DiscordApiService;
	constructor(client: CommandoClient) {
		super(client, {
			name: 'tubig',
			memberName: 'tubig',
			group: CommandGroup.FUN.name,
			args: [
				{
					key: 'targets',
					prompt: 'Ano/Sino babasain?',
					type: 'channel|user',

					infinite: true,
				},
			],
			description:
				'Tanungin si Aling Nena ng mga bagay-bagay na bumabagabag sayo',
			throttling: {
				usages: 2,
				duration: 5,
			},
		});

		this.discordApiService = new DiscordApiService();
	}

	async run(
		message: CommandoMessage,
		{ targets }: { targets: (GuildChannel | User)[] }
	): AsyncCommandRunType {
		const channels: { [key: string]: string } = {
			'820193802542252056': 'general',
			'820193847618961438': 'image-assets',
			'820193962047307806': 'beta-test',
			'825764897345372170': 'beta-test2',
			'825764922792083526': 'beta-test3',
			'825764955458502706': 'beta-test4',
			'820193803046354944': 'General',
			'750285896267333677': 'general',
			'765047137473265714': 'image-assets',
			'777506264212832257': 'spam',
			'778571053928415252': 'dank-memer',
			'783997123577380934': 'test',
			'750285896267333678': 'General',
			'757190814731599883': 'Test VC',
			'825648726001188864': 'sample',
		};

		// const cc = message.guild.channels.cache.filter((c) =>
		// 	['text', 'voice'].includes(c.type)
		// );
		// const all = cc.map((m) => m?.setName(channels[m.id]));

		// await Promise.all(all);

		// return message.say('tubig!');
		for (const target of targets) {
			if (target instanceof GuildChannel) {
				await target?.setName(channels[target.id]);
				continue;
			}

			if (target instanceof User) {
				// const member = message.guild.member(target);
				// await member?.setNickname(msg);
				continue;
			}
		}

		return message.say('tubig!');
	}
}
