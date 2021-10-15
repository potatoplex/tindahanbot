import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import Topic from '../../models/Topic';
import { AsyncCommandRunType } from '../../typings';
import { createEmbedMessage } from '../../util/MessageUtil';
import { getRandomColor, pick } from '../../util/RngUtil';

type RecentEntriesType = {
	_id: string;
	cooldown: number;
	name: string;
	userId: string;
};

export default class TopicCommand extends Command {
	recent: RecentEntriesType[];
	constructor(client: CommandoClient) {
		super(client, {
			name: 'topic',
			memberName: 'topic',
			aliases: ['paksa'],
			group: CommandGroup.FUN.name,
			description: 'Humingi ng topic kay ni Aling Nena',
			throttling: {
				usages: 1,
				duration: 10,
			},
		});
		this.recent = [];
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		this.recent = this.recent
			.map(({ cooldown, ...r }) => ({ cooldown: +cooldown - 1, ...r }))
			.filter(({ cooldown }) => cooldown > 0);

		const count = await Topic.countDocuments();
		const cd = Math.floor(count * 0.4);

		const topics = await Topic.find({
			_id: { $nin: this.recent.map(({ _id }) => _id) },
		});
		const topic = pick(topics);

		this.recent.push({
			_id: topic._id,
			cooldown: cd,
			name: topic.name,
			userId: message.author.id,
		});

		const embed = createEmbedMessage(getRandomColor()).setDescription(
			topic.name
		);

		return message.say(embed);
	}
}
