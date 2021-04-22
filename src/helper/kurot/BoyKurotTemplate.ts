import { createCanvas, loadImage } from 'canvas';
import { Message, MessageAttachment } from 'discord.js';
import { CommandoMessage } from 'discord.js-commando';
import UserImageEntry from '../image/UserImageEntry';
import ImageBuilder from '../image/ImageBuilder';
import BaseKurotTemplate from './BaseKurotTemplate';

const BG_URL = `https://media.discordapp.net/attachments/820193847618961438/833319058597347348/EbP3GYjXsAE--4m.png`;
export default class BoyKurotTemplate extends BaseKurotTemplate {
	async render(
		message: CommandoMessage | Message
	): Promise<MessageAttachment> {
		const authorImg = new UserImageEntry(message.author, 170, {
			x: 0.64,
			y: 0.12,
		});
		const targetImg = new UserImageEntry(this.target, 160, {
			x: 0.15,
			y: 0.22,
		});

		const builder = new ImageBuilder(
			{ width: 750, height: 412 },
			[authorImg, targetImg],
			BG_URL
		);

		const attachment = await builder.render();

		return attachment;
	}
}
