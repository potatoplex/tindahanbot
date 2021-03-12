import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
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
		const items = (await this.client.provider.get(
			'750285896267333674',
			'cmd-paninda-items'
		)) as string[];
		const paninda = pick(items).toUpperCase();
		const embed = createEmbedMessage(getRandomColor()).setDescription(
			paninda
		);

		return message.say(embed);
	}
}
