import { createCanvas, loadImage } from 'canvas';
import { Message, MessageAttachment, User } from 'discord.js';
import { CommandoMessage } from 'discord.js-commando';
import BaseKurotTemplate from './BaseKurotTemplate';

export default class NsfwKurotTemplate extends BaseKurotTemplate {
	constructor(target: User) {
		super(target, true);
	}
	async render(
		message: CommandoMessage | Message
	): Promise<MessageAttachment> {
		const template = {
			image: {
				url: `https://media.discordapp.net/attachments/820193847618961438/833319025462870076/SPOILER_FqtqF4SW_fAbKmWMNeOxjw2Fcustom-Custom_Size___ScreenShot2019-07-10at3.png`,
				width: 750,
				height: 412,
			},
			avatar: {
				target1: {
					dimensions: {
						width: 100,
						height: 100,
					},
					coordinates: (w: number, h: number) => ({
						x: w * 0.2,
						y: h * 0.15,
					}),
				},
				target2: {
					dimensions: {
						width: 100,
						height: 100,
					},
					coordinates: (w: number, h: number) => ({
						x: w * 0.7,
						y: h * 0.12,
					}),
				},
			},
		};
		const { image, avatar } = template;

		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		const background = await loadImage(image.url);

		const firstTargetAvatar = await loadImage(
			message.author.displayAvatarURL({ format: 'png', size: 256 })
		);
		const secondTargetAvatar = await loadImage(
			this.target.displayAvatarURL({ format: 'png', size: 256 })
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
		ctx.beginPath();
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

		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'kurot.png'
		);

		return attachment;
	}
}
