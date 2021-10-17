import { Message, User } from "discord.js";
import {
  bold,
  getEmoji,
  mentionAuthor,
  mentionUser,
} from "../../util/MessageUtil";
import { pick } from "../../util/RngUtil";
import Paninda from "./Paninda";

export default class IceCreamPaninda extends Paninda {
  constructor() {
    super("Ice Cream 🍨", ["ice cream", "sorbetes"], 20, 90);
  }

  successSpiel = (user: User): string => {
    const item = bold(this.name.toUpperCase());
    const cry = getEmoji(user.client, "maritesCry", "😢");

    const flavors = [
      "VANILLA",
      "ROCKY ROAD",
      "COOKIES AND CREAM",
      "DOUBLE DUTCH",
      "PEANUT BUTTER",
      "AMPALAYA",
      "MANG TOMAS",
      "PASAS",
      "ADOBO",
      "SINIGANG",
    ].map((f) => bold(f));

    const adlibs = [
      `na 3 in 1 + 1. Buti pa yung ${item} may +1 ${cry}`,
      `at nanood ng ${bold(`NETFLIX`)} mag isa habang umiiyak`,
      ...Array(2)
        .fill(undefined)
        .map(
          () =>
            `na ${pick(
              flavors
            )} flavor sa cone. Nadapa sya sa daan at natapon ito`
        ),
    ];

    return `Bumili si ${mentionUser(user)} ng ${item} ${pick(adlibs)}.`;
  };

  failSpiel = (user: User): string => {
    const cry = getEmoji(user.client, "pepeHands", ":cry:");
    return `Bumili si ${mentionUser(user)} ng ${bold(
      this.name.toUpperCase()
    )} pero nung binuksan, ${bold(`ISDA`)} ang laman ${cry}`;
  };
}
