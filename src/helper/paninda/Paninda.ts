import { CommandoMessage } from 'discord.js-commando';
import { bold, mentionAuthor } from '../../util/MessageUtil';

export default abstract class Paninda {
	name: string;
	aliases: string[];
	price: number;
	succeRate: number;
	constructor(
		name: string,
		aliases: string[],
		price: number,
		successRate: number
	) {
		this.name = name;
		this.aliases = aliases;
		this.price = price;
		this.succeRate = successRate;
	}

	abstract successSpiel: (_message: CommandoMessage) => string;

	failSpiel = (message: CommandoMessage): string => {
		return `Hindi nakabili si ${mentionAuthor(message)} ${bold(
			this.name.toUpperCase()
		)} kasi out of stock. Pasensya ka na ha. God Bless.`;
	};
}
