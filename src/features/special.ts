import { Util } from "discord.js";
import Client from "../helper/Client";
import { createEmbedMessage } from "../util/MessageUtil";

type RegexResponse = {
  regex: RegExp;
  message: string;
};

const responses: RegexResponse[] = [
  {
    regex: new RegExp(/pa[\s]*utang[\s]*nena[.]*/, "gi"),
    message: `P******** MO RIN!`,
  },
];

export default (client: Client): void => {
  client.on("message", async (message) => {
    if (message.author.bot) return;

    if (!message.content) return;
    const match = responses.find((r) => r.regex.test(message.content));

    if (!match) return;

    const embed = createEmbedMessage("RANDOM").setDescription(
      Util.escapeMarkdown(match.message)
    );

    message.reply({ embeds: [embed] });
  });
};

const config = {
  displayName: "Watch for 8ball cue",
  dbName: "8BALL",
};

export { config };
