import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import MessageService from "../../services/MessageService";
import { createEmbedMessage } from "../../util/MessageUtil";

const MAX_HISTORY = 5;

export default CommandBuilder.build({
  category: CommandGroup.FUN.name,
  aliases: ["brrt"],
  description: "Show recently deleted message in channel",
  slash: "both",
  expectedArgs: "<size>",
  expectedArgsTypes: ["NUMBER"],
  globalCooldown: "1m",
  callback: async ({ args, channel, guild }) => {
    const s = Number(args[0]) || 1;
    const size = Math.min(MAX_HISTORY, s);

    const messages = await MessageService.getDeletedMessages(channel.id, size);

    if (messages.length > 0) {
      const expiration = 180;

      const endTime = new Date();
      const spiels = messages
        .filter(({ createdAt, content }) => {
          const startTime = new Date(createdAt);

          const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000;
          const seconds = Math.round(timeDiff);
          return content && seconds <= expiration;
        })
        .map(({ user: authorID, content, createdAt }) => {
          const member = guild?.members.cache.find(
            ({ user }) => user.id === authorID
          );
          if (!member) return undefined;
          const { displayName: nickname, user } = member;
          const { username } = user;
          const avatar = user.displayAvatarURL({ format: "png" });
          return createEmbedMessage("#0099ff")
            .setAuthor(nickname || username, avatar)
            .setDescription(content)
            .setTimestamp(+createdAt);
        })
        .filter((v) => !!v);

      if (spiels.length > 0) {
        return spiels;
      }
    }

    return createEmbedMessage("#0099ff").setAuthor("There's nothing to snipe!");
  },
});
