import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import HotdogWeapon from "../../helper/weapon/HotdogWeapon";
import { bold, getEmoji, underline } from "../../util/MessageUtil";
import { doRoll } from "../../util/RngUtil";

export default CommandBuilder.build({
  category: CommandGroup.FUN.name,
  aliases: ["hakdog"],
  description: "Ipakita ang hakdog",
  slash: "both",
  expectedArgs: "<target>",
  expectedArgsTypes: ["USER"],
  callback: async ({
    client,
    args,
    guild,
    user,
    member,
    channel,
    interaction,
    message,
  }) => {
    const hotdog = new HotdogWeapon(doRoll(5) + 1, client);
    const toothpick1 = getEmoji(client, "toothpick3");
    const toothpick2 = getEmoji(client, "toothpick2");
    const sticks = (item: string) => `${toothpick2}${item}${toothpick1}`;

    const target = args[0] || user.id;

    const memberMatch =
      guild?.members.cache.find(({ user }) => user.id === target) || member;
    const nickname = memberMatch?.displayName;
    const line1 = bold(
      underline(
        `Hakdog ni ${nickname || memberMatch?.user.username}:`.toUpperCase()
      )
    );
    const line2 = sticks(hotdog.render());

    if (message) {
      await message.reply(line1);
      return channel.send(line2);
    }

    if (interaction) {
      await interaction.reply(line1);
      channel.send(line2);
      return null;
    }
  },
});
