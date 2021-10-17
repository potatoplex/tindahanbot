import { User } from "discord.js";
import { bold, mentionUser } from "../../util/MessageUtil";
import { pick } from "../../util/RngUtil";
import Paninda from "./Paninda";

export default class PiattosPaninda extends Paninda {
  constructor() {
    super("Piattos 🔶", ["piattos"], 10, 90);
  }

  successSpiel = (user: User): string => {
    const flavors = [
      "CHEESE",
      "SOUR CREAM",
      "ROAST BEEF",
      "NACHO PIZZA",
      "ROADHOUSE BARBECUE",
      "SALTED POTATO",
    ];

    const flavor = pick(flavors);

    const peros = [
      `${bold(`HANGIN`)} ang laman`,
      `${bold(`BOY BAWANG`)} ang laman`,
      `nabubuksan lang pag mahilig ka sa ${bold(`PAKSIW NA ISDA`)}`,
      `expired na`,
      `kinuha ng ${bold(`KOALA`)}`,
    ];

    const pero = pick(peros);

    return `Bumili si ${mentionUser(user)} ng ${bold(
      this.name.toUpperCase()
    )} na ${bold(flavor)} pero ${pero}.`;
  };
}
