import { CommandoMessage } from 'discord.js-commando';
import { bold, getEmoji, mentionAuthor } from '../../util/MessageUtil';
import { pick } from '../../util/RngUtil';
import Paninda from './Paninda';

export default class IceCreamPaninda extends Paninda {
	constructor() {
		super('Ice Cream 🍨', ['ice cream', 'sorbetes'], 20, 90);
	}

	successSpiel = (message: CommandoMessage): string => {
		const item = bold(this.name.toUpperCase());
		const cry = getEmoji(message.client, 'maritesCry', '😢');

		const flavors = [
			'VANILLA',
			'ROCKY ROAD',
			'COOKIES AND CREAM',
			'DOUBLE DUTCH',
			'PEANUT BUTTER',
			'AMPALAYA',
			'MANG TOMAS',
			'PASAS',
		].map((f) => bold(f));

		const adlibs = [
			`na 3 in 1 + 1. Buti pa yung ${item} may +1 ${cry}`,
			`at nanood ng ${bold(`NETFLIX`)} mag isa habang umiiyak`,
			...Array(2)
				.fill(undefined)
				.map(
					() =>
						`na ${pick(
							flavors
						)} flavor sa cone. Nadapa sya sa daan at natapon ito`
				),
		];

		return `Bumili si ${mentionAuthor(message)} ng ${item} ${pick(
			adlibs
		)}.`;
	};

	failSpiel = (message: CommandoMessage): string => {
		const cry = getEmoji(message.client, 'pepeHands', ':cry:');
		return `Bumili si ${mentionAuthor(message)} ng ${bold(
			this.name.toUpperCase()
		)} pero nung binuksan, ${bold(`ISDA`)} ang laman ${cry}`;
	};
}
