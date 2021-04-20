import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import AnnounceCommand from '../../common/AnnounceCommand';
import { mentionUser, repeatMessage } from '../../util/MessageUtil';
import { CommandRunType, SingleUserArgType } from '../../typings';

export default class WelcomeCommand extends AnnounceCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'welcome',
			memberName: 'welcome',
			aliases: ['wc'],
			group: CommandGroup.GENERAL.name,
			description: 'Welcome new kapotchis',
			args: [
				{
					key: 'target',
					prompt: 'SINO IWEWELCOME MO MAMIII?',
					type: 'user',
					default: '',
				},
			],
		});
	}

	run(
		message: CommandoMessage,
		{ target }: SingleUserArgType
	): CommandRunType {
		const potchi = this.getEmoji('potchi');
		let spiel = `WELCOME MGA KAPOTCHIII!!! SANA DI KAYO MAGING INACTIVE!!!`;

		if (target) {
			spiel = `WELCOME KAPOTCHIII ${mentionUser(
				target
			)}!!! SANA DI KA MAGING INACTIVE!!!`;
		}
		spiel += `\n${repeatMessage(potchi)}`;

		this.embed.description = spiel;

		return super.run(message);
	}
}
