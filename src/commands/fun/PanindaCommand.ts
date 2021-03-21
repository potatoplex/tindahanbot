import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import Paninda from '../../models/Paninda';
import DiscordApiService from '../../services/DiscordApiService';
import { AsyncCommandRunType } from '../../typings';
import { createEmbedMessage } from '../../util/MessageUtil';
import { getRandomColor, pick } from '../../util/RngUtil';

export default class PanindaCommand extends Command {
	discordApiService: DiscordApiService;
	constructor(client: CommandoClient) {
		super(client, {
			name: 'paninda',
			memberName: 'paninda',
			aliases: ['pabili'],
			group: CommandGroup.FUN.name,
			description: 'Bumili ng paninda sa Tindahan ni Aling Nena',
			throttling: {
				usages: 2,
				duration: 5,
			},
		});
		this.discordApiService = new DiscordApiService();
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		const panindas = await Paninda.find({});
		const paninda = pick(panindas.map(({ name }) => name)).toUpperCase();
		const embed = createEmbedMessage(getRandomColor()).setDescription(
			paninda
		);

		return message.say(embed);
	}
}
