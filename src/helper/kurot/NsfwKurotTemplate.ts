import { Message, MessageAttachment, User } from 'discord.js';
import { CommandoMessage } from 'discord.js-commando';
import UserImageEntry from '../image/UserImageEntry';
import ImageBuilder from '../image/ImageBuilder';
import BaseKurotTemplate from './BaseKurotTemplate';

const BG_URL = `https://media.discordapp.net/attachments/820193847618961438/833319025462870076/SPOILER_FqtqF4SW_fAbKmWMNeOxjw2Fcustom-Custom_Size___ScreenShot2019-07-10at3.png`;
export default class NsfwKurotTemplate extends BaseKurotTemplate {
	constructor(target: User) {
		super(target, true);
	}
	async render(
		message: CommandoMessage | Message
	): Promise<MessageAttachment> {
		const authorImg = new UserImageEntry(message.author, 100, {
			x: 0.2,
			y: 0.15,
		});
		const targetImg = new UserImageEntry(this.target, 100, {
			x: 0.7,
			y: 0.12,
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
