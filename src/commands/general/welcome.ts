import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import {
  createEmbedMessage,
  getEmoji,
  mentionUser,
  repeatMessage,
} from "../../util/MessageUtil";

export default CommandBuilder.build({
  category: CommandGroup.GENERAL.name,
  aliases: ["hl"],
  description: "Welcome new kapotchis",
  slash: "both",
  expectedArgs: "<target>",
  expectedArgsTypes: ["USER"],
  options: [
    {
      name: "target",
      description: "Yung iwewelcome mo",
      type: "USER",
      required: false,
    },
  ],
  callback: async ({ client, guild, args }) => {
    const potchi = getEmoji(client, "potchi");
    let spiel = `WELCOME MGA KAPOTCHIII!!! SANA DI KAYO MAGING INACTIVE!!!`;
    const targetId = args[0];

    const target = guild?.members.cache.find(
      ({ user }) => user.id === targetId
    )?.user;

    if (target) {
      spiel = `WELCOME KAPOTCHIII ${mentionUser(
        target
      )}!!! SANA DI KA MAGING INACTIVE!!!`;
    }
    spiel += `\n${repeatMessage(potchi)}`;

    return createEmbedMessage("RANDOM").setDescription(spiel);
  },
});
