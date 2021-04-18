import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import Paninda from '../../models/Paninda';
import PanindaReklamo, {
	PanindaReklamoType,
} from '../../models/PanindaReklamo';
import DiscordApiService from '../../services/DiscordApiService';
import { AsyncCommandRunType } from '../../typings';
import { createEmbedMessage, mentionAuthor } from '../../util/MessageUtil';
import { getRandomColor, pick, rateRoll } from '../../util/RngUtil';

type RecentPanindaType = {
	_id: string;
	cooldown: number;
	name: string;
	userId: string;
};

export default class PanindaCommand extends Command {
	recent: RecentPanindaType[];
	constructor(client: CommandoClient) {
		super(client, {
			name: 'paninda',
			memberName: 'paninda',
			aliases: ['pabili'],
			group: CommandGroup.FUN.name,
			description: 'Bumili ng paninda sa Tindahan ni Aling Nena',
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

		const count = await Paninda.count();
		const cd = Math.floor(count * 0.4);

		const panindas = await Paninda.find({
			_id: { $nin: this.recent.map(({ _id }) => _id) },
		});
		const paninda = pick(panindas);

		this.recent.push({
			_id: paninda._id,
			cooldown: cd,
			name: paninda.name,
			userId: message.author.id,
		});

		const purchaseCounter = this.recent.reduce(
			(prev: { [key: string]: number }, next) => {
				const prevCount = prev[next.userId] || 0;
				return { ...prev, [next.userId]: +prevCount + 1 };
			},
			{}
		);

		if (
			purchaseCounter[message.author.id] >= Math.floor(cd / 4) &&
			rateRoll(50)
		) {
			const reklamos: PanindaReklamoType[] = await PanindaReklamo.find(
				{}
			);
			const reklamo = pick(reklamos.map((r) => r.name));
			return message.say(
				createEmbedMessage(getRandomColor()).setDescription(
					reklamo.replace('{user}', mentionAuthor(message))
				)
			);
		}
		const embed = createEmbedMessage(getRandomColor()).setDescription(
			paninda.name
		);

		return message.say(embed);
	}
}
