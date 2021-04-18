import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import Eightball from '../../models/Eightball';
import DiscordApiService from '../../services/DiscordApiService';
import { AsyncCommandRunType } from '../../typings';
import { createEmbedMessage } from '../../util/MessageUtil';
import { getRandomColor, pick } from '../../util/RngUtil';

export default class EightBallCommand extends BaseCommand {
	discordApiService: DiscordApiService;
	constructor(client: CommandoClient) {
		super(client, {
			name: '8ball',
			memberName: '8ball',
			hidden: true,
			patterns: [new RegExp(/^aling[\s]+nena[\s]*[,][\s]*/, 'i')],
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
		const answers = await Eightball.find({});
		const answer = pick(answers.map(({ name }) => name));
		const embed = createEmbedMessage(getRandomColor()).setDescription(
			`🔮 ${answer}`
		);

		return message.say(embed);
	}
}
