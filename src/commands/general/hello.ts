import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import {
  createEmbedMessage,
  getEmoji,
  repeatMessage,
} from "../../util/MessageUtil";

export default CommandBuilder.build({
  category: CommandGroup.GENERAL.name,
  aliases: ["hl"],
  description: "Say hello to your kapotchis",
  slash: "both",
  callback: async ({ client }) => {
    const potchi = getEmoji(client, "potchi");
    return createEmbedMessage().setTitle(
      `HELLO MGA KAPOTCHIII!!! ${repeatMessage(potchi)}`.trim()
    );
  },
});
