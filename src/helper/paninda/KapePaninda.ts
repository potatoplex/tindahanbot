import { User } from "discord.js";
import { bold, mentionUser } from "../../util/MessageUtil";
import { doRoll, pick, rateRoll } from "../../util/RngUtil";
import Paninda from "./Paninda";

export default class KapePaninda extends Paninda {
  sauceRate = 60;
  toppingsRate = 50;
  constructor() {
    super("Kape ☕", ["kape", "coffee"], 150, 90);
  }

  successSpiel = (user: User): string => {
    const size = ["TALL", "GRANDE", "VENTI"].map(bold);

    const base = [
      "CARAMEL MACCHIATO",
      "CAFE LATTE",
      "3 IN 1 COFFEE",
      "COLD BREW",
      "KAPE BARAKO",
    ].map(bold);

    let syrup = "";

    if (rateRoll(this.sauceRate)) {
      const sauce = [
        "VANILLA SYRUP",
        "HAZELNUT SYRUP",
        "WHITE MOCHA SYRUP",
        "MANG TOMAS",
        "PEANUT BUTTER",
        "BANANA KETCHUP",
        "GRAVY",
      ].map(bold);

      const pumpCount = rateRoll(30) ? `69` : doRoll(2) + 2;
      syrup = `${bold(`${pumpCount} pumps`)} of ${pick(sauce)}`;
    }

    let toppings = "";

    if (rateRoll(this.toppingsRate)) {
      const t = [
        "BREAD CRUMBS",
        "POTCHIS",
        "SISIG",
        "ADOBO FLAKES",
        "PASAS",
        "DOLOMITE SAND",
        "SIOMAI",
      ].map(bold);

      toppings = `${pick(t)} on top`;
    }

    const addons = [syrup, toppings].filter((t) => t.trim()).join(" and ");
    const addonSpiel = addons ? ` with ${addons}` : "";

    return `One ${pick(size)} ${pick(base)}${addonSpiel} for ${mentionUser(
      user
    )} at the counter please.`;
  };

  failSpiel = (user: User): string => {
    const spiels = [
      `${bold(`DECAF COFFEE`)} kasi ${bold(`DECAF`)}inili`,
      `${bold(`MATAPANG NA KAPE`)} pero di parin siya kayang ipaglaban`,
      `WALANG KAPE! Nakaleave yung barista ngayon`,
    ];

    return `Bumili si ${mentionUser(user)} ng ${pick(spiels)}.`;
  };
}
