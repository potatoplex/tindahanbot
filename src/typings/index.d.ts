import { AxiosResponse } from 'axios';
import { Message, Snowflake, User } from 'discord.js';
import { CommandoClientOptions } from 'discord.js-commando';

/* ---- Config ---- */
type ConfigType = Partial<CommandoClientOptions> & {
	activity: {
		name: string;
		type: 'LISTENING' | 'PLAYING' | 'WATCHING';
	};
};

/* ---- Command Group ---- */
enum CommandGroupKeys {
	'GENERAL',
	'FUN',
	'UTILITY',
	'GAME',
}

type CommandGroupType = {
	[key in CommandGroupKeys[keyof CommandGroupKeys]]: {
		name: string;
		description: string;
	};
};

/************************/
/**  Command ArgTypes  **/
/************************/

/* ---- Common ArgTypes ---- */
interface SingleUserArgType {
	target: User;
}

/* ---- Potchi ArgTypes ---- */
interface PotchiArgType {
	quantity: number;
}

/* ---- Pabili ArgTypes ---- */
interface PabiliArgType {
	paninda: string;
}

type AsyncCommandRunType = Promise<Message | Message[] | null>;
type CommandRunType = AsyncCommandRunType | null;
