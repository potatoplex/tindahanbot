type CommandGroupKeys = 'GENERAL' | 'FUN' | 'MOD' | 'GAME';

type CommandGroupType = {
	[key in CommandGroupKeys]: {
		name: string;
		description: string;
	};
};

const CommandGroup: CommandGroupType = {
	GENERAL: {
		name: 'general',
		description: 'General Purpose Commands',
	},
	FUN: {
		name: 'fun',
		description: 'Fun Commands',
	},
	MOD: {
		name: 'mod',
		description: 'Moderator Commands',
	},
	GAME: {
		name: 'game',
		description: 'Game Commands',
	},
};

export default CommandGroup;
