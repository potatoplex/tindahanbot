import { Message, MessageAttachment, User } from 'discord.js';
import { CommandoMessage } from 'discord.js-commando';

export default abstract class BaseKurotTemplate {
	target: User;
	nsfw = false;
	constructor(target: User, nsfw = false) {
		this.target = target;
		this.nsfw = nsfw;
	}
	abstract render(
		message: CommandoMessage | Message
	): Promise<MessageAttachment>;
}
