import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import ImageBuilder, {
	Dimensions,
	Coordinates,
	ImageEntry,
} from '../../helper/image/ImageBuilder';
import UserImageEntry from '../../helper/image/UserImageEntry';
import { AsyncCommandRunType, SingleUserArgType } from '../../typings';
import { pick } from '../../util/RngUtil';

const BAKUNA_IMG = `https://media.discordapp.net/attachments/820193847618961438/833318396410069032/vaccine.png`;
const WIDTH = 1000;
const HEIGHT = 800;

type Bakuna = {
	[key: string]: {
		url: string;
		coordinates: Coordinates;
		dimensions: Dimensions;
	};
};

const logoCoords: Coordinates = {
	x: 0.65,
	y: 0.05,
};

const bakunas: Bakuna = {
	pfizer: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318426595688458/pfizer.png',
		dimensions: {
			width: 0.1 * WIDTH,
			height: 0.1 * HEIGHT,
		},
		coordinates: logoCoords,
	},
	redhorse: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318484922073108/redhorse.png',
		dimensions: {
			width: WIDTH * 0.1,
			height: HEIGHT * 0.13,
		},
		coordinates: logoCoords,
	},

	vaseline: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318524532686858/vaseline.png',
		dimensions: {
			width: WIDTH * 0.13,
			height: HEIGHT * 0.1,
		},
		coordinates: logoCoords,
	},
	shell: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318551892262933/shell.png',
		dimensions: {
			width: WIDTH * 0.1,
			height: HEIGHT * 0.12,
		},
		coordinates: logoCoords,
	},
	petron: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318571600773131/petron.png',
		dimensions: {
			width: WIDTH * 0.1,
			height: HEIGHT * 0.13,
		},
		coordinates: logoCoords,
	},
	minola: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318600165031988/minola.png',
		dimensions: {
			width: WIDTH * 0.13,
			height: HEIGHT * 0.1,
		},
		coordinates: { ...logoCoords, x: 0.63 },
	},
	starbucks: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318627746250762/starbucks.png',
		dimensions: {
			width: WIDTH * 0.1,
			height: HEIGHT * 0.12,
		},
		coordinates: logoCoords,
	},
	coke: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318668817399878/coke.png',
		dimensions: {
			width: WIDTH * 0.1,
			height: HEIGHT * 0.12,
		},
		coordinates: logoCoords,
	},
	pepsi: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318701629046814/pepsi.png',
		dimensions: {
			width: WIDTH * 0.1,
			height: HEIGHT * 0.1,
		},
		coordinates: logoCoords,
	},
	rc: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318769937481728/rc.png',
		dimensions: {
			width: WIDTH * 0.1,
			height: HEIGHT * 0.12,
		},
		coordinates: logoCoords,
	},
	aot: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318793669247007/aot.png',
		dimensions: {
			width: WIDTH * 0.1,
			height: HEIGHT * 0.14,
		},
		coordinates: logoCoords,
	},
	melkti: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318835372949524/melkti.png',
		dimensions: {
			width: WIDTH * 0.1,
			height: HEIGHT * 0.13,
		},
		coordinates: logoCoords,
	},
	bj: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318871498358794/bukojuan-1.png',
		dimensions: {
			width: WIDTH * 0.13,
			height: HEIGHT * 0.1,
		},
		coordinates: logoCoords,
	},
};

export default class BakunaCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'bakuna',
			memberName: 'bakuna',
			aliases: ['bk', 'patusok', 'tosoken', 'tusok', 'tosok'],
			group: CommandGroup.IMAGE.name,
			description: 'Pabakunahan ang pfp',
			args: [
				{
					key: 'target',
					prompt: 'SINO ANG TOTOSOKEN MAMIII?',
					type: 'user',
					default: (message: Message) => message.author,
				},
				{
					key: 'bakuna',
					prompt: 'ANONG BAKUNA IINJECT NATIN MAMIII?',
					type: 'string',
					oneOf: Object.keys(bakunas),
					default: () => pick(Object.keys(bakunas)),
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ target, bakuna: bakunaKey }: SingleUserArgType & { bakuna: string }
	): AsyncCommandRunType {
		const pickedBakuna = bakunas[bakunaKey.toLowerCase()];
		const {
			dimensions: bakunaDims,
			coordinates: bakunaCoords,
			url: bakunaUrl,
		} = pickedBakuna;

		const brandImg = new ImageEntry(
			bakunaUrl,
			bakunaDims,
			bakunaCoords,
			false
		);
		const targetImg = new UserImageEntry(
			target,
			HEIGHT,
			{ x: 0, y: 0 },
			false,
			1024
		);
		const bakunaImg = new ImageEntry(
			BAKUNA_IMG,
			{ width: WIDTH, height: HEIGHT },
			{ x: 0, y: 0 }
		);

		const builder = new ImageBuilder({ width: WIDTH, height: HEIGHT }, [
			targetImg,
			bakunaImg,
			brandImg,
		]);

		const attachment = await builder.render();
		return await message.channel.send(attachment);
	}
}
