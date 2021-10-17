import { User } from "discord.js";
import { bold, mentionUser } from "../../util/MessageUtil";
import { doRoll, pick, shuffle } from "../../util/RngUtil";
import Paninda from "./Paninda";

export default class CantonPaninda extends Paninda {
  constructor() {
    super(
      "Pancit Canton 🍜",
      ["canton", "pancit", "pancit canton", "migoreng", "lucky me"],
      666,
      90
    );
  }

  successSpiel = (user: User): string => {
    let extra = "";

    const ing = ["NOODLES", "SEASONING"];

    const inuna = shuffle(ing)
      .map((i) => bold(i))
      .join(" bago ");

    if (doRoll(100) < 50) {
      const extras = ["AMPALAYA", "PEANUT BUTTER", "MANG TOMAS", "PASAS"];
      extra = ` at dinagdagan ng ${bold(pick(extras))}`;
    }

    return `Bumili si ${mentionUser(user)} ng ${bold(
      `PANCIT CANTON`
    )} inuna ang ${inuna}${extra}.`;
  };
}
