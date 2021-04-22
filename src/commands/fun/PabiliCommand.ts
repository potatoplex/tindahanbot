import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';

import CantonPaninda from '../../helper/paninda/CantonPaninda';
import JowaPaninda from '../../helper/paninda/JowaPaninda';
import PiattosPaninda from '../../helper/paninda/PiattosPaninda';
import ShabuPaninda from '../../helper/paninda/ShabuPaninda';
import IceCreamPaninda from '../../helper/paninda/IceCreamPaninda';
import KapePaninda from '../../helper/paninda/KapePaninda';
import CommandGroup from '../../enums/CommandGroup';
import { rateRoll } from '../../util/RngUtil';
import { AsyncCommandRunType, PabiliArgType } from '../../typings';
import BaseCommand from '../../common/BaseCommand';

const items = [
	new ShabuPaninda(),
	new CantonPaninda(),
	new PiattosPaninda(),
	new JowaPaninda(),
	new IceCreamPaninda(),
	new KapePaninda(),
];

export default class PabiliCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'pabili',
			memberName: 'pabili',
			aliases: ['pb'],
			group: CommandGroup.FUN.name,
			description: 'Bumili ng paninda sa Tindahan ni Aling Nena',
			args: [
				{
					key: 'paninda',
					prompt: 'ANO BIBILHIN MO MAMIII?',
					type: 'string',
					default: '',
					parse: (value: string) => {
						return value.length > 0 ? value : null;
					},
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ paninda }: PabiliArgType
	): AsyncCommandRunType {
		let spiel: string | MessageEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Paninda')
			.setAuthor('Aling Nena')
			.setDescription('Mga Paninda sa Tindahan ni Aling Nena')
			.setThumbnail(
				'https://cdn.discordapp.com/icons/749742356466761922/73a5e5150238a0af17992739d9346641.webp'
			)
			.addFields(
				...items.map(({ name, price }) => ({
					name,
					value: `₱${price.toFixed(2)}`,
					inline: true,
				}))
			)
			.setFooter(
				`Type ${message.guild.commandPrefix}pabili <item> to buy`
			);

		if (paninda) {
			const removeSpaces = (str = '') =>
				str.replace(/\s+/g, '').toLowerCase();
			const match = items.find(({ aliases }) =>
				aliases.some(
					(alias) => removeSpaces(alias) === removeSpaces(paninda)
				)
			);

			if (match) {
				const { succeRate, successSpiel, failSpiel } = match;

				const success = rateRoll(succeRate);

				spiel = success ? successSpiel(message) : failSpiel(message);
			}
		}
		await message.guild.fetch();
		return message.channel.send(
			(spiel as MessageEmbed).setFooter(
				`Type ${message.guild.commandPrefix}pabili <item> to buy`
			)
		);
	}
}
