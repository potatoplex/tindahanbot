import { GuildEmoji } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import { AsyncCommandRunType, PotchiArgType } from '../../typings';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import { repeatMessage } from '../../util/MessageUtil';

export default class PotchiArmyCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'potchi',
			memberName: 'potchi',
			aliases: ['po'],
			group: CommandGroup.FUN.name,
			description: 'Summon a Potchi army',
			args: [
				{
					key: 'quantity',
					prompt: 'ILANG POTCHIS GUSTO MO ISUMMON MAMIII?',
					type: 'integer',
					default: 3,
					max: 69,
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ quantity }: PotchiArgType
	): AsyncCommandRunType {
		const potchi = this.getEmoji('potchi');
		const response = await message.say(
			repeatMessage<GuildEmoji>(potchi, quantity)
		);
		if (quantity === 69) {
			const hehe = this.getEmoji('heheBoye', '😈');
			await message.react(hehe);
		}

		return response;
	}
}
