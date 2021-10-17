import { User } from "discord.js";
import { bold, mentionUser } from "../../util/MessageUtil";
import Paninda from "./Paninda";

export default class ShabuPaninda extends Paninda {
  constructor() {
    super("Shabu 😈", ["shabu", "asukal", "asin"], 420, 30);
  }

  successSpiel = (user: User): string => {
    return `Bumili si ${mentionUser(user)} ng ${bold(
      this.name.toUpperCase()
    )} dali dali nyang itinago ito sa kanyang bulsa`;
  };
  failSpiel = (user: User): string => {
    return `Nahuli ng mga pulis si ${mentionUser(user)} hawak hawak ang ${bold(
      this.name.toUpperCase()
    )}. Himas rehas sya ngayon.`;
  };
}
