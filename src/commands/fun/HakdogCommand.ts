import { Message } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import HotdogWeapon from '../../helper/weapon/HotdogWeapon';
import { AsyncCommandRunType, SingleUserArgType } from '../../typings';
import { bold, underline } from '../../util/MessageUtil';
import { doRoll } from '../../util/RngUtil';

export default class HakdogCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'hotdog',
			memberName: 'hotdog',
			aliases: ['hakdog'],
			group: CommandGroup.FUN.name,
			description: 'Ipakita ang hakdog',
			args: [
				{
					key: 'target',
					prompt: 'KANINONG HAKDOG PAPAKITA MO MAMIII?',
					type: 'user',
					default: (message: Message) => message.author,
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ target }: SingleUserArgType
	): AsyncCommandRunType {
		const hotdog = new HotdogWeapon(doRoll(5) + 1, this.client);
		const toothpick1 = this.getEmoji('toothpick3');
		const toothpick2 = this.getEmoji('toothpick2');
		const sticks = (item: string) => `${toothpick2}${item}${toothpick1}`;

		const { username } = target;
		const member = message.guild.member(target);
		const nickname = member?.displayName;

		await message.say(
			bold(underline(`Hakdog ni ${nickname || username}:`.toUpperCase()))
		);

		return await message.say(sticks(hotdog.render()));
	}
}
