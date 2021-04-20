import { CommandoMessage } from 'discord.js-commando';
import { bold, mentionAuthor } from '../../util/MessageUtil';
import { pick } from '../../util/RngUtil';
import Paninda from './Paninda';

export default class JowaPaninda extends Paninda {
	constructor() {
		super('Jowa 💔', ['jowa', 'forever', 'poreber', 'toyo'], 69, 60);
	}

	successSpiel = (message: CommandoMessage): string => {
		const sanas = [
			'Sana all',
			'Sana naman magtagal kayo',
			'Sana mag break kayo. Salamat nalang sa lahat',
			'Sana ako nalang inorder mo.',
			'Last mo na yan ha',
			'Ako yung idineliver',
		];

		const sana = pick(sanas);

		return `Umorder si ${mentionAuthor(message)} ng ${bold(
			`JOWA`
		)}. ${sana}.`;
	};

	failSpiel = (message: CommandoMessage): string => {
		const spiels = [
			`DI MO AFFORD MAGKAJOWA MAMIII ${mentionAuthor(message)}`,
			`EW MAMIII ${mentionAuthor(message)} WALANG JOWA`,
			`IPON KA MUNA MAMIII ${mentionAuthor(
				message
			)} PARA MAY PAMBILI NG JOWA`,
		];

		return pick(spiels);
	};
}
