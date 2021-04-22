import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import CommandGroup from '../../enums/CommandGroup';
import PastokQuestion from '../../models/PastokQuestion';
import { AsyncCommandRunType, SingleUserArgType } from '../../typings';
import { createEmbedMessage } from '../../util/MessageUtil';
import { pick } from '../../util/RngUtil';

type RecentEntriesType = {
	_id: string;
	cooldown: number;
	name: string;
};

export default class PastokCommand extends Command {
	recent: RecentEntriesType[];

	constructor(client: CommandoClient) {
		super(client, {
			name: 'pastok',
			memberName: 'pastok',
			aliases: ['pt', 'ft', 'fasttalk'],
			group: CommandGroup.FUN.name,
			description: 'TWBA style fast talk',
			guildOnly: true,
			args: [
				{
					key: 'target',
					prompt: 'SINO TATANUNGIN MO MAMIII?',
					type: 'user',
					default: (message: Message) => message.author,
				},
			],
		});
		this.recent = [];
	}

	async run(
		message: CommandoMessage,
		{ target }: SingleUserArgType
	): AsyncCommandRunType {
		this.recent = this.recent
			.map(({ cooldown, ...r }) => ({ cooldown: +cooldown - 1, ...r }))
			.filter(({ cooldown }) => cooldown > 0);
		const count = await PastokQuestion.countDocuments();
		const cd = Math.floor(count * 0.4);

		const questions = await PastokQuestion.find({
			_id: { $nin: this.recent.map(({ _id }) => _id) },
		});
		const question = pick(questions);

		this.recent.push({
			_id: question._id,
			cooldown: cd,
			name: question.name,
		});

		const { guild } = message;
		const { username } = target;

		const member = guild.member(target);
		const nickname = member?.displayName;

		const spiel = createEmbedMessage('#0099ff', `${question.name}?`)
			.setAuthor(
				`${nickname || username}, IKAW NA!`,
				'https://cdn.discordapp.com/attachments/765047137473265714/768419284765507634/tito_boy.png'
			)
			.setThumbnail(target.displayAvatarURL({ format: 'png' }));
		return message.channel.send(spiel);
	}
}
