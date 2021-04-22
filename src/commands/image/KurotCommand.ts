import { TextChannel } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import BoyKurotTemplate from '../../helper/kurot/BoyKurotTemplate';
import GirlKurotTemplate from '../../helper/kurot/GirlKurotTemplate';
import NsfwKurotTemplate from '../../helper/kurot/NsfwKurotTemplate';
import { AsyncCommandRunType, SingleUserArgType } from '../../typings';
import { pick } from '../../util/RngUtil';

export default class KurotCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'kurot',
			memberName: 'kurot',
			group: CommandGroup.IMAGE.name,
			description: 'Kurutin ang kapotchi',
			aliases: ['pinch', 'pisil'],
			args: [
				{
					key: 'target',
					prompt: 'SINO KUKURUTIN MO MAMIII?',
					type: 'user',
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ target }: SingleUserArgType
	): AsyncCommandRunType {
		const isNsfw =
			message.channel.type === 'dm' ||
			(message.channel as TextChannel).nsfw;

		const template = pick(
			[BoyKurotTemplate, GirlKurotTemplate, NsfwKurotTemplate]
				.map((x) => new x(target))
				.filter((x) => (isNsfw ? true : !x.nsfw))
		);

		const prefix = template.nsfw ? 'SPOILER_' : '';
		const attachment = await template.render(message);
		return await message.channel.send(
			attachment.setName(`${prefix}kurot.png`)
		);
	}
}
