import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import AnnounceCommand from '../../common/AnnounceCommand';
import { repeatMessage } from '../../util/MessageUtil';
import { CommandRunType } from '../../typings';

export default class HelloCommand extends AnnounceCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'hello',
			memberName: 'hello',
			aliases: ['hl'],
			group: CommandGroup.GENERAL.name,
			description: 'Say hello to your kapotchis',
		});
	}

	run(message: CommandoMessage): CommandRunType {
		const potchi = this.getEmoji('potchi');
		const spiel = `HELLO MGA KAPOTCHIII!!! ${repeatMessage(potchi)}`.trim();

		this.embed.description = spiel;

		return super.run(message);
	}
}
