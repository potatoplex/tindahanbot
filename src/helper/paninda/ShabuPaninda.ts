import { CommandoMessage } from 'discord.js-commando';
import { bold, mentionAuthor } from '../../util/MessageUtil';
import Paninda from './Paninda';

export default class ShabuPaninda extends Paninda {
	constructor() {
		super('Shabu 😈', ['shabu', 'asukal', 'asin'], 420, 30);
	}

	successSpiel = (message: CommandoMessage): string => {
		return `Bumili si ${mentionAuthor(message)} ng ${bold(
			this.name.toUpperCase()
		)} dali dali nyang itinago ito sa kanyang bulsa`;
	};
	failSpiel = (message: CommandoMessage): string => {
		return `Nahuli ng mga pulis si ${mentionAuthor(
			message
		)} hawak hawak ang ${bold(
			this.name.toUpperCase()
		)}. Himas rehas sya ngayon.`;
	};
}
