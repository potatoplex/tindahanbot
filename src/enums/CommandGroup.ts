type CommandGroupKeys = 'GENERAL' | 'FUN' | 'UTILITY' | 'GAME';

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
	UTILITY: {
		name: 'utility',
		description: 'Utililty Commands',
	},
	GAME: {
		name: 'game',
		description: 'Game Commands',
	},
};

export default CommandGroup;
