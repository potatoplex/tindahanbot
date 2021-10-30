import { createCanvas } from "canvas";
import { MessageAttachment, MessageEmbed } from "discord.js";
import Venti from "../../helper/paninda/kape/container/size/Venti";
import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import CaramelMacchiato from "../../helper/paninda/kape/base/CaramelMacchiato";
import Grande from "../../helper/paninda/kape/container/size/Grande";
import Tall from "../../helper/paninda/kape/container/size/Tall";
import { doRoll, pick } from "../../util/RngUtil";
import KapeBarako from "../../helper/paninda/kape/base/KapeBarako";
import CafeLatte from "../../helper/paninda/kape/base/CafeLatte";
import VanillaSyrup from "../../helper/paninda/kape/decorator/sauce/VanillaSyrup";
import Ketchup from "../../helper/paninda/kape/decorator/sauce/Ketchup";
import MatchaLatte from "../../helper/paninda/kape/base/MatchaLatte";
import Mug from "../../helper/paninda/kape/container/Mug";
import ThreeInOne from "../../helper/paninda/kape/base/ThreeInOne";
import { bold, createEmbedMessage, mentionUser } from "../../util/MessageUtil";
import MangTomas from "../../helper/paninda/kape/decorator/sauce/MangTomas";
import Gravy from "../../helper/paninda/kape/decorator/sauce/Gravy";
import PotchiTopping from "../../helper/paninda/kape/decorator/topping/PotchiTopping";
import SiomaiTopping from "../../helper/paninda/kape/decorator/topping/SiomaiTopping";

export default CommandBuilder.build({
  category: CommandGroup.IMAGE.name,
  description: "testa",
  callback: async ({ interaction, user, member }) => {
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext("2d");

    const Base = pick([
      CaramelMacchiato,
      KapeBarako,
      CafeLatte,
      MatchaLatte,
      ThreeInOne,
    ]);
    // const Base = pick([ThreeInOne]);
    const Container = pick([Mug]);
    const Size = pick([Tall, Grande, Venti]);
    const Sauce = pick([VanillaSyrup, Ketchup, MangTomas, Gravy]);
    const Topping = pick([PotchiTopping, SiomaiTopping]);
    const Sauce2 = pick([VanillaSyrup, Ketchup]);
    await interaction.deferReply();

    // const out = new Sauce2(
    //   new Sauce(new Container(new Size(new Base(ctx))), doRoll(3) + 1),
    //   doRoll(3) + 1
    // );
    const container = new Container(ctx, new Size());
    const out = new Topping(new Sauce(new Base(ctx, container), doRoll(3) + 1));
    await out.render();

    const resolveString = (value?: string, cb = (v: string) => v): string =>
      value ? cb(value) : "";
    const base = resolveString(out.getBase().name, bold);
    const size = resolveString(out.getContainer()?.size.name, bold);
    const sauce = out.getSauce();
    const sauceName = resolveString(sauce?.name, (v) => {
      const quantity = sauce!.quantity;
      const pump = `pump${quantity > 1 ? "s" : ""}`;
      return `with ${quantity} ${pump} of ${bold(v)}`;
    });
    const toppings = resolveString(
      out.getToppings()?.name,
      (v) => `and ${bold(v)} on top`
    );
    const filename = "kape.png";
    const attachment = new MessageAttachment(canvas.toBuffer(), filename);
    const message = [
      "One",
      size,
      base,
      sauceName,
      toppings,
      `for ${mentionUser(user)} at the counter please`,
    ]
      .join(" ")
      .toUpperCase();

    const embed = createEmbedMessage("RANDOM")
      .setDescription(message)
      .setFooter(member.displayName, user.displayAvatarURL({ size: 256 }))
      .setImage(`attachment://${filename}`);

    await interaction.followUp({
      embeds: [embed],
      files: [attachment],
    });
  },
});
