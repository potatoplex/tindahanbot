import { MessageEmbed } from "discord.js";
import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import CantonPaninda from "../../helper/paninda/CantonPaninda";
import IceCreamPaninda from "../../helper/paninda/IceCreamPaninda";
import JowaPaninda from "../../helper/paninda/JowaPaninda";
import KapePaninda from "../../helper/paninda/KapePaninda";
import PiattosPaninda from "../../helper/paninda/PiattosPaninda";
import ShabuPaninda from "../../helper/paninda/ShabuPaninda";
import { createEmbedMessage } from "../../util/MessageUtil";
import { rateRoll } from "../../util/RngUtil";

const items = [
  new ShabuPaninda(),
  new CantonPaninda(),
  new PiattosPaninda(),
  new JowaPaninda(),
  new IceCreamPaninda(),
  new KapePaninda(),
];

export default CommandBuilder.build({
  category: CommandGroup.FUN.name,
  aliases: ["pb"],
  description: "Bumili ng paninda sa Tindahan ni Aling Nena",
  slash: "both",
  expectedArgs: "<paninda>",
  expectedArgsTypes: ["STRING"],
  callback: async ({ user, guild, instance, args }) => {
    let hasMatch = false;
    let spiel: string | MessageEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Paninda")
      .setAuthor("Aling Nena")
      .setDescription("Mga Paninda sa Tindahan ni Aling Nena")
      .setThumbnail(
        "https://cdn.discordapp.com/icons/749742356466761922/73a5e5150238a0af17992739d9346641.webp"
      )
      .setFooter(`Type ${instance.getPrefix(guild?.id)}pabili <item> to buy`)
      .addFields(
        ...items.map(({ name, price }) => ({
          name,
          value: `₱${price.toFixed(2)}`,
          inline: true,
        }))
      );
    const [paninda] = args;

    if (paninda) {
      const removeSpaces = (str = "") => str.replace(/\s+/g, "").toLowerCase();
      const match = items.find(({ aliases }) =>
        aliases.some((alias) => removeSpaces(alias) === removeSpaces(paninda))
      );

      if (match) {
        hasMatch = true;
        const { succeRate, successSpiel, failSpiel } = match;

        const success = rateRoll(succeRate);

        spiel = success ? successSpiel(user) : failSpiel(user);
      }
    }

    return hasMatch
      ? createEmbedMessage("RANDOM").setDescription(spiel as string)
      : spiel;
  },
});
