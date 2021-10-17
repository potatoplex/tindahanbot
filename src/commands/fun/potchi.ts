import { GuildEmoji, Message } from "discord.js";
import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import { getEmoji, repeatMessage } from "../../util/MessageUtil";

export default CommandBuilder.build({
  category: CommandGroup.FUN.name,
  aliases: ["po"],
  description: "Summon a Potchi army",
  slash: "both",
  expectedArgs: "<quantity>",
  expectedArgsTypes: ["INTEGER"],
  callback: async ({ client, args, interaction }) => {
    const potchi = getEmoji(client, "potchi");
    let quantity = +args[0] || 1;

    if (quantity > 100) quantity = 100;

    const message = (await interaction.reply({
      content: repeatMessage<GuildEmoji>(potchi, quantity),
      fetchReply: true,
    })) as Message;
    if (quantity === 69) {
      const hehe = getEmoji(client, "heheBoye", "😈");
      await message.react(hehe);
    }

    return null;
  },
});
