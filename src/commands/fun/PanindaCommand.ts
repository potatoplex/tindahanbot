import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import Paninda from '../../models/Paninda';
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

const reklamos: (string | ((m: CommandoMessage) => string))[] = [
	(m) =>
		`${mentionAuthor(
			m
		)}, dami mo nang kinuha ha. Siguraduhin mong babayaran mo yan`,
	(m) => `${mentionAuthor(m)}, wag kang mang hoard oi!`,
	(m) => `Hinay hinay lang ${mentionAuthor(m)}! Pabilhin mo naman yung iba`,
	(m) => `${mentionAuthor(m)}, ang dami mong binili because?`,
	(m) =>
		`${mentionAuthor(
			m
		)}, tama na yan nalulugi na tindahan ko sayo. Di ka nagbabayad e.`,
];

export default class PanindaCommand extends Command {
	recent: RecentPanindaType[];
	discordApiService: DiscordApiService;
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
		this.discordApiService = new DiscordApiService();
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
		const embed = createEmbedMessage(getRandomColor()).setDescription(
			paninda.name
		);

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

		const messages = [embed];

		if (purchaseCounter[message.author.id] >= cd && rateRoll(40)) {
			const reklamo = pick(reklamos);
			messages.push(
				createEmbedMessage(getRandomColor()).setDescription(
					typeof reklamo === 'function' ? reklamo(message) : reklamo
				)
			);
		}

		return Promise.all(messages.map((m) => message.say(m)));
	}
}
