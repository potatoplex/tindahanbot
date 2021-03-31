import { Channel, GuildChannel, TextChannel, VoiceChannel } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import Eightball from '../../models/Eightball';
import DiscordApiService from '../../services/DiscordApiService';
import { AsyncCommandRunType } from '../../typings';
import { createEmbedMessage, delay } from '../../util/MessageUtil';
import { getRandomColor, pick } from '../../util/RngUtil';

export default class SunogCommand extends BaseCommand {
	discordApiService: DiscordApiService;
	constructor(client: CommandoClient) {
		super(client, {
			name: 'drill',
			memberName: 'drill',
			group: CommandGroup.FUN.name,
			description:
				'Tanungin si Aling Nena ng mga bagay-bagay na bumabagabag sayo',
			throttling: {
				usages: 2,
				duration: 5,
			},
		});

		this.discordApiService = new DiscordApiService();
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		const channels: { [key: string]: string } = {
			'820193802542252056': 'general',
			'820193847618961438': 'image-assets',
			'820193962047307806': 'beta-test',
			'825764897345372170': 'beta-test2',
			'825764922792083526': 'beta-test3',
			'825764955458502706': 'beta-test4',
			'820193803046354944': 'General',
		};
		// await message.say(
		// 	message.guild.channels.cache.map((c) => c.name).join(',')
		// );

		const cc: {
			[key: string]: string;
		} = message.guild.channels.cache.reduce(
			(prev, next: GuildChannel) => ({ ...prev, [next.id]: next.name }),
			{}
		);

		return message.say(
			'```json\n{\n' +
				Object.keys(cc)
					.map((c) => `    "${c}": "${cc[c]}"`)
					.join(',\n') +
				'\n}\n```'
		);
	}
}
