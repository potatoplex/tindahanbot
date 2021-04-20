import { CommandoMessage } from 'discord.js-commando';
import { bold, mentionAuthor } from '../../util/MessageUtil';
import { doRoll, pick, rateRoll } from '../../util/RngUtil';
import Paninda from './Paninda';

export default class KapePaninda extends Paninda {
	sauceRate = 60;
	toppingsRate = 50;
	constructor() {
		super('Kape ☕', ['kape', 'coffee'], 150, 90);
	}

	successSpiel = (message: CommandoMessage): string => {
		const size = ['TALL', 'GRANDE', 'VENTI'].map(bold);

		const base = [
			'CARAMEL MACCHIATO',
			'CAFE LATTE',
			'3 IN 1 COFFEE',
			'COLD BREW',
			'KAPE BARAKO',
		].map(bold);

		let syrup = '';

		if (rateRoll(this.sauceRate)) {
			const sauce = [
				'VANILLA SYRUP',
				'HAZELNUT SYRUP',
				'WHITE MOCHA SYRUP',
				'MANG TOMAS',
				'PEANUT BUTTER',
				'BANANA KETCHUP',
			].map(bold);

			syrup = `${bold(`${doRoll(2) + 2} pumps`)} of ${pick(sauce)}`;
		}

		let toppings = '';

		if (rateRoll(this.toppingsRate)) {
			const t = ['BREAD CRUMBS', 'POTCHIS', 'ADOBO FLAKES', 'PASAS'].map(
				bold
			);

			toppings = `${pick(t)} on top`;
		}

		const addons = [syrup, toppings].filter((t) => t.trim()).join(' and ');
		const addonSpiel = addons ? ` with ${addons}` : '';

		return `One ${pick(size)} ${pick(
			base
		)}${addonSpiel} for ${mentionAuthor(message)} at the counter please.`;
	};

	failSpiel = (message: CommandoMessage): string => {
		const spiels = [
			`${bold(`DECAF COFFEE`)}  kasi ${bold(`DECAF`)}inili`,
			`${bold(`MATAPANG NA KAPE`)} pero di parin siya kayang ipaglaban`,
		];

		return `Bumili si ${mentionAuthor(message)} ng ${pick(spiels)}.`;
	};
}
