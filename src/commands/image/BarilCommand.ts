import { CommandoMessage, CommandoClient } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import UserImageEntry from '../../helper/image/UserImageEntry';
import ImageBuilder from '../../helper/image/ImageBuilder';
import { AsyncCommandRunType, SingleUserArgType } from '../../typings';

const BG_URL =
	'https://media.discordapp.net/attachments/765047137473265714/833949306117292052/2017-08-21_151713_680-Ika-6-Na-Utos-Ryza-nerf-gun.png';

export default class BarilCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'baril',
			memberName: 'baril',
			group: CommandGroup.IMAGE.name,
			description: 'Barilin ang kapotchi',
			args: [
				{
					key: 'target',
					prompt: 'SINO BABARILIN MO MAMIII?',
					type: 'user',
				},
			],
		});
	}
	public async run(
		message: CommandoMessage,
		{ target }: SingleUserArgType
	): AsyncCommandRunType {
		try {
			const authorImg = new UserImageEntry(message.author, 100, {
				x: 0.13,
				y: 0.2,
			});
			const targetImg = new UserImageEntry(target, 100, {
				x: 0.7,
				y: 0.15,
			});

			const builder = new ImageBuilder(
				{ width: 680, height: 383 },
				[targetImg, authorImg],
				BG_URL
			);
			const attachment = await builder.render();

			return await message.channel.send(attachment);
		} catch (error) {
			console.log(error);

			return null;
		}
	}
}
