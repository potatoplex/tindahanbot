import { CommandoMessage } from 'discord.js-commando';
import { bold, mentionAuthor } from '../../util/MessageUtil';
import { pick } from '../../util/RngUtil';
import Paninda from './Paninda';

export default class PiattosPaninda extends Paninda {
	constructor() {
		super('Piattos 🔶', ['piattos'], 10, 90);
	}

	successSpiel = (message: CommandoMessage): string => {
		const flavors = [
			'CHEESE',
			'SOUR CREAM',
			'ROAST BEEF',
			'NACHO PIZZA',
			'ROADHOUSE BARBECUE',
		];

		const flavor = pick(flavors);

		const peros = [
			`${bold(`HANGIN`)} ang laman`,
			`${bold(`BOY BAWANG`)} ang laman`,
			`nabubuksan lang pag mahilig ka sa ${bold(`PAKSIW NA ISDA`)}`,
			`expired na`,
			`kinuha ng ${bold(`KOALA`)}`,
		];

		const pero = pick(peros);

		return `Bumili si ${mentionAuthor(message)} ng ${bold(
			this.name.toUpperCase()
		)} na ${bold(flavor)} pero ${pero}.`;
	};
}
