import { createCanvas, loadImage } from 'canvas';
import { Message, MessageAttachment } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType, SingleUserArgType } from '../../typings';
import { pick } from '../../util/RngUtil';

const BAKUNA_IMG = `https://media.discordapp.net/attachments/820193847618961438/833318396410069032/vaccine.png`;
const WIDTH = 1000;
const HEIGHT = 800;

const AVATAR_W = HEIGHT;
const AVATAR_H = HEIGHT;

type Coordinates = {
	x: number;
	y: number;
};

type Dimensions = {
	width: number;
	height: number;
};

type Bakuna = {
	[key: string]: {
		url: string;
		coordinates: Coordinates;
		dimensions: Dimensions;
	};
};

const logoCoords: Coordinates = {
	x: AVATAR_W * 0.8,
	y: HEIGHT * 0.05,
};

const bakunas: Bakuna = {
	pfizer: {
		url:
			'https://media.discordapp.net/attachments/820193847618961438/833318426595688458/pfizer.png',
		dimensions: {
			width: WIDTH * 0.1,
			height: HEIGHT * 0.1,
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
		coordinates: { ...logoCoords, x: AVATAR_W * 0.77 },
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
		coordinates: { ...logoCoords, x: AVATAR_W * 0.76 },
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
			group: CommandGroup.FUN.name,
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
		const canvas = createCanvas(WIDTH, HEIGHT);
		const ctx = canvas.getContext('2d');
		const background = await loadImage(BAKUNA_IMG);
		const targetAvatar = await loadImage(
			target.displayAvatarURL({ format: 'png', size: 1024 })
		);

		const pickedBakuna = bakunas[bakunaKey];
		const {
			dimensions: bakunaDims,
			coordinates: bakunaCoords,
			url: bakunaUrl,
		} = pickedBakuna;
		const bakuna = await loadImage(bakunaUrl);

		ctx.drawImage(targetAvatar, 0, 0, AVATAR_W, AVATAR_H);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			bakuna,
			bakunaCoords.x,
			bakunaCoords.y,
			bakunaDims.width,
			bakunaDims.height
		);

		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'bakuna.png'
		);

		return await message.channel.send(attachment);
	}
}
