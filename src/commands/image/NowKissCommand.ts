import { createCanvas, loadImage } from 'canvas';
import { Message, MessageAttachment, User } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType } from '../../typings';

type ArgType = {
	img: string;
	firstTarget: User;
	secondTarget: User;
};

type Dimensions = {
	width: number;
	height: number;
};

type Coordinates = {
	x: number;
	y: number;
};

type TargetType = {
	dimensions: Dimensions;
	coordinates: (w: number, h: number) => Coordinates;
};

type KissType = {
	[key: string]: {
		image: Dimensions & {
			url: string;
		};
		avatar: {
			target1: TargetType;
			target2: TargetType;
		};
	};
};

const KISS_IMG: KissType = {
	kith: {
		image: {
			url: `https://media.discordapp.net/attachments/820193847618961438/833318912861929502/hqdefault.png`,
			width: 480,
			height: 360,
		},
		avatar: {
			target1: {
				dimensions: {
					width: 40,
					height: 40,
				},
				coordinates: (w, h) => ({
					x: w * 0.4,
					y: h * 0.4,
				}),
			},
			target2: {
				dimensions: {
					width: 40,
					height: 40,
				},
				coordinates: function (w, h) {
					return {
						x: w * 0.47,
						y: h * 0.4,
					};
				},
			},
		},
	},
	kiss: {
		image: {
			url: `https://media.discordapp.net/attachments/820193847618961438/833318935029219328/iu.png`,
			width: 750,
			height: 585,
		},
		avatar: {
			target1: {
				dimensions: {
					width: 70,
					height: 70,
				},
				coordinates: (w, h) => ({
					x: w * 0.64,
					y: h * 0.5,
				}),
			},
			target2: {
				dimensions: {
					width: 85,
					height: 85,
				},
				coordinates: function (w, h) {
					return {
						x: w * 0.72,
						y: h * 0.57,
					};
				},
			},
		},
	},
};

export default class NowKissCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'now',
			memberName: 'now',
			group: CommandGroup.FUN.name,
			description: 'Make two people kiss',
			args: [
				{
					key: 'img',
					prompt: 'NOW WHAT MAMIII?',
					type: 'string',
					oneOf: Object.keys(KISS_IMG),
				},
				{
					key: 'firstTarget',
					prompt: 'SINO HAHALIKAN MO MAMIII?',
					type: 'user',
				},
				{
					key: 'secondTarget',
					prompt: 'SINO HAHALIKAN MO MAMIII?',
					type: 'user',
					default: (message: Message) => message.author,
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ img, firstTarget, secondTarget }: ArgType
	): AsyncCommandRunType {
		const template = KISS_IMG[img.toLowerCase()];
		const { image, avatar } = template;

		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		const background = await loadImage(image.url);
		const firstTargetAvatar = await loadImage(
			firstTarget.displayAvatarURL({ format: 'png', size: 128 })
		);
		const secondTargetAvatar = await loadImage(
			secondTarget.displayAvatarURL({ format: 'png', size: 128 })
		);

		const target1Coords = avatar.target1.coordinates(
			image.width,
			image.height
		);
		const target2Coords = avatar.target2.coordinates(
			image.width,
			image.height
		);

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		const { x: t1x, y: t1y } = target1Coords;
		const { x: t2x, y: t2y } = target2Coords;
		const {
			target1: {
				dimensions: { width: t1Width, height: t1Height },
			},
			target2: {
				dimensions: { width: t2Width, height: t2Height },
			},
		} = avatar;
		ctx.arc(
			t1x + t1Width * 0.5,
			t1y + t1Height * 0.5,
			t1Width * 0.5,
			0,
			Math.PI * 2,
			true
		);
		ctx.arc(
			t2x + t2Width * 0.5,
			t2y + t2Height * 0.5,
			t2Width * 0.5,
			0,
			Math.PI * 2,
			true
		);
		ctx.closePath();
		ctx.clip();

		ctx.drawImage(
			firstTargetAvatar,
			target1Coords.x,
			target1Coords.y,
			avatar.target1.dimensions.width,
			avatar.target1.dimensions.height
		);
		ctx.drawImage(
			secondTargetAvatar,
			target2Coords.x,
			target2Coords.y,
			avatar.target2.dimensions.width,
			avatar.target2.dimensions.height
		);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'kiss.png');

		return await message.channel.send(attachment);
	}
}
