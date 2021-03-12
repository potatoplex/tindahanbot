import dotenv from 'dotenv';

dotenv.config();

const {
	BOT_TOKEN,
	BOT_PREFIX,
	OWNER_ID,
	BOT_ACTIVITY_NAME,
	BOT_ACTIVITY_TYPE,
	DISCORD_API_URL,
	INACTIVE_BASE_ROLE,
	INACTIVE_ACTIVITY_ROLES,
	INVITE_CHANNEL,
	DB_URL,
	DB_NAME,
} = process.env;

export default {
	commandPrefix: BOT_PREFIX,
	owner: OWNER_ID,
	token: BOT_TOKEN,
	dbUrl: DB_URL || '',
	dbName: DB_NAME || '',
	activity: {
		name: BOT_ACTIVITY_NAME,
		type: BOT_ACTIVITY_TYPE,
	},
	api: {
		discord: DISCORD_API_URL,
	},
	inviteChannel: INVITE_CHANNEL,
	commands: {
		inactive: {
			baseRole: INACTIVE_BASE_ROLE,
			activityRoles: INACTIVE_ACTIVITY_ROLES?.split(';'),
		},
	},
};
