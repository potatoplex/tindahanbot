import { Intents } from "discord.js";
import WOKCommands from "wokcommands";
import path from "path";
import config from "./config";
import Client from "./helper/Client";
import mongoose from "mongoose";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
});

client.on("ready", async () => {
  await mongoose.connect(`${config.dbUrl}/${config.dbName}`, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  });

  const dbOptions = {
    keepAlive: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };

  new WOKCommands(client, {
    commandDir: path.join(__dirname, "commands"),
    featureDir: path.join(__dirname, "features"),
    typeScript: process.env.NODE_ENV !== "production",
    dbOptions,
    testServers: config.testServers,
    mongoUri: `${config.dbUrl}/${config.dbName}`,
    disabledDefaultCommands: ["help"],
    ignoreBots: true,
    botOwners: config.owners,
  }).setDefaultPrefix(config.commandPrefix);

  console.log("The bot is ready");
});

client.login(config.token);
