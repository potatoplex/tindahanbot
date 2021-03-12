import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import { MongoClient } from 'mongodb';
import { MongoDBProvider } from 'commando-provider-mongo';

import { ConfigType } from './typings';

import config from './config';
import CommandGroup from './enums/CommandGroup';

const client = new CommandoClient({
	...config,
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
});

client.registry
	.registerDefaultTypes()
	.registerGroups(
		Object.values(CommandGroup).map(({ name, description }) => [
			name,
			description,
		])
	)
	.registerDefaultGroups()
	.registerDefaultCommands({ unknownCommand: false })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client
	.setProvider(
		MongoClient.connect(config.dbUrl || '', {
			useUnifiedTopology: true,
		}).then(
			(client: MongoClient) => new MongoDBProvider(client, config.dbName)
		)
	)
	.catch(console.error);

client.once('ready', () => {
	const {
		activity: { name, type },
	} = (config as unknown) as ConfigType;
	console.log(`Logged in as ${client.user?.tag}! (${client.user?.id})`);
	client.user?.setActivity(name, { type });
});

client.on('error', console.error);

client.login(config.token);
