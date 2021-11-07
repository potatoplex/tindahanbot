import { createCanvas } from "canvas";
import {
  ColorResolvable,
  GuildMember,
  InteractionReplyOptions,
  MessageAttachment,
  User,
} from "discord.js";
import { bold, createEmbedMessage, mentionUser } from "../../util/MessageUtil";
import { doRoll, pick, rateRoll } from "../../util/RngUtil";
import CafeLatte from "./kape/base/CafeLatte";
import CaramelMacchiato from "./kape/base/CaramelMacchiato";
import KapeBarako from "./kape/base/KapeBarako";
import MatchaLatte from "./kape/base/MatchaLatte";
import ThreeInOne from "./kape/base/ThreeInOne";
import Mug from "./kape/container/Mug";
import Grande from "./kape/container/size/Grande";
import Tall from "./kape/container/size/Tall";
import Venti from "./kape/container/size/Venti";
import Gravy from "./kape/decorator/sauce/Gravy";
import Ketchup from "./kape/decorator/sauce/Ketchup";
import MangTomas from "./kape/decorator/sauce/MangTomas";
import VanillaSyrup from "./kape/decorator/sauce/VanillaSyrup";
import DolomiteSand from "./kape/decorator/topping/DolomiteSand";
import PotchiTopping from "./kape/decorator/topping/PotchiTopping";
import SiomaiTopping from "./kape/decorator/topping/SiomaiTopping";
import Sisig from "./kape/decorator/topping/Sisig";
import Paninda from "./Paninda";
import getImageColors from "get-image-colors";
import IKape from "./kape/IKape";
import Pasas from "./kape/decorator/topping/Pasas";

export default class KapePaninda extends Paninda {
  sauceRate = 70;
  toppingsRate = 60;
  constructor() {
    super("Kape ☕", ["kape", "coffee"], 150, 90);
  }

  successSpiel = async (
    user: User,
    member: GuildMember
  ): Promise<InteractionReplyOptions> => {
    const Container = pick([Mug]);
    const Size = pick([Tall, Grande, Venti]);
    const Base = pick([
      CaramelMacchiato,
      KapeBarako,
      CafeLatte,
      MatchaLatte,
      ThreeInOne,
    ]);

    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext("2d");
    const container = new Container(ctx, new Size());

    let out: IKape = new Base(ctx, container);

    if (rateRoll(this.sauceRate)) {
      const Sauce = pick([VanillaSyrup, Ketchup, MangTomas, Gravy]);
      out = new Sauce(out, doRoll(3) + 1);
    }

    if (rateRoll(this.toppingsRate)) {
      const Topping = pick([
        PotchiTopping,
        SiomaiTopping,
        Sisig,
        DolomiteSand,
        Pasas,
      ]);
      out = new Topping(out);
    }

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

    await out.render();
    const filename = "kape.png";
    const buffer = canvas.toBuffer();
    const attachment = new MessageAttachment(buffer, filename);
    const message = ["One", size, base, sauceName, toppings]
      .join(" ")
      .toUpperCase();

    const [embedColor] = await getImageColors(buffer, "image/png");

    const c = (embedColor?.hex() || "RANDOM") as ColorResolvable;
    const embed = createEmbedMessage(c)
      .setDescription(message)
      .setFooter(
        `Kape ni ${member.displayName}`,
        user.displayAvatarURL({ size: 256 })
      )
      .setImage(`attachment://${filename}`);

    return {
      embeds: [embed],
      files: [attachment],
    };
  };

  failSpiel = (user: User): string => {
    const spiels = [
      `${bold(`DECAF COFFEE`)} kasi ${bold(`DECAF`)}inili`,
      `${bold(`MATAPANG NA KAPE`)} pero di parin siya kayang ipaglaban`,
    ]
      .map((x) => `Bumili si ${mentionUser(user)} ng ${x}.`)
      .concat([
        `WALANG KAPE! Nakaleave yung barista ngayon`,
        `TIMPLA KA SARILI MONG KAPE BALAKAJAN!`,
      ]);
    return pick(spiels);
  };
}
