import dotenv from "dotenv";

dotenv.config();

const {
  BOT_TOKEN,
  BOT_PREFIX,
  OWNER_IDS,
  BOT_ACTIVITY_NAME,
  BOT_ACTIVITY_TYPE,
  DISCORD_API_URL,
  INACTIVE_BASE_ROLE,
  INACTIVE_ACTIVITY_ROLES,
  INVITE_CHANNEL,
  DB_URL,
  DB_NAME,
  TEST_SERVERS,
  TEST_ONLY,
} = process.env;

export default {
  commandPrefix: BOT_PREFIX || "!",
  owners: OWNER_IDS?.split("|") || [],
  token: BOT_TOKEN,
  dbUrl: DB_URL || "",
  dbName: DB_NAME || "",
  testServers: TEST_SERVERS ? TEST_SERVERS.split("|") : [],
  testOnly: TEST_ONLY ? TEST_ONLY.toLowerCase() === "true" : false,
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
      activityRoles: INACTIVE_ACTIVITY_ROLES?.split(";"),
    },
  },
};
