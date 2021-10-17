import Client from "../helper/Client";
import Eightball from "../models/Eightball";
import { createEmbedMessage } from "../util/MessageUtil";
import { pick } from "../util/RngUtil";

export default (client: Client): void => {
  client.on("message", async (message) => {
    if (message.author.bot) return;
    const match = new RegExp(/^aling[\s]+nena[\s]*[,][\s]*/, "i").test(
      message.content
    );

    if (!match) return;

    const answers = await Eightball.find({});
    const answer = pick(answers.map(({ name }) => name));
    const embed = createEmbedMessage("RANDOM").setDescription(`🔮 ${answer}`);

    message.reply({ embeds: [embed] });
  });
};

const config = {
  displayName: "Watch for 8ball cue",
  dbName: "8BALL",
};

export { config };
