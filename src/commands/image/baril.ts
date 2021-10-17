import ImageBuilder from "../../helper/image/ImageBuilder";
import UserImageEntry from "../../helper/image/UserImageEntry";
import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";

const BG_URL =
  "https://media.discordapp.net/attachments/820193847618961438/834791757191315466/2017-08-21_151713_680-Ika-6-Na-Utos-Ryza-nerf-gun.png";

export default CommandBuilder.build({
  category: CommandGroup.IMAGE.name,
  description: "Barilin ang kapotchi",
  options: [
    {
      name: "target",
      description: "Yung babarilin mo",
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

    await interaction.deferReply();

    const authorImg = new UserImageEntry(user, 100, {
      x: 0.13,
      y: 0.2,
    });
    const targetImg = new UserImageEntry(target, 100, {
      x: 0.7,
      y: 0.15,
    });

    const builder = new ImageBuilder(
      { width: 680, height: 383 },
      [targetImg, authorImg],
      BG_URL
    );
    const attachment = await builder.render();

    await interaction.followUp({ files: [attachment] });
    return null;
  },
});
