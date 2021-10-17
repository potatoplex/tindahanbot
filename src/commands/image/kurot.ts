import BoyKurotTemplate from "../../helper/kurot/BoyKurotTemplate";
import GirlKurotTemplate from "../../helper/kurot/GirlKurotTemplate";
import NsfwKurotTemplate from "../../helper/kurot/NsfwKurotTemplate";
import { pick } from "../../util/RngUtil";
import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";

export default CommandBuilder.build({
  category: CommandGroup.IMAGE.name,
  aliases: ["pinch", "pisil"],
  description: "Kurutin ang kapotchi",
  guildOnly: true,
  cooldown: "10s",
  options: [
    {
      name: "target",
      description: "Yung gusto mong kurutin",
      type: "USER",
      required: true,
    },
  ],
  slash: true,
  callback: async ({ user, args, guild, interaction, message, channel }) => {
    const targetId = args[0];

    const target = guild?.members.cache.find(
      ({ user }) => user.id === targetId
    )?.user;

    if (!target) return "Provide a target";

    const isNsfw = channel.nsfw;

    const template = pick(
      [BoyKurotTemplate, GirlKurotTemplate, NsfwKurotTemplate]
        .map((x) => new x(target))
        .filter((x) => (isNsfw ? true : !x.nsfw))
    );

    const prefix = template.nsfw ? "SPOILER_" : "";
    await interaction.deferReply();

    const attachment = await template.render(user);
    await interaction.followUp({
      files: [attachment.setName(`${prefix}kurot.png`)],
    });
    return null;
  },
});
