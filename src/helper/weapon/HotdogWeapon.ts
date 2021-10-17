import { repeatMessage } from "../../util/MessageUtil";
import { pick } from "../../util/RngUtil";
import Client from "../Client";
import Weapon from "./Weapon";

const emojis = {
  small: "hotdogSmol",
  start: "hotdog1",
  mid: "hotdog2",
  end: "hotdog3",
  top: "marshmallowPink",
  bottom: "marshmallowWhite",
};

export default class HotdogWeapon extends Weapon {
  constructor(length: number, client: Client) {
    super(length, emojis, "🟥", client);
  }

  render(): string {
    const { start, mid, end, top, bottom, small } = this.emojis;

    const marshmallow = () => {
      const pool = [top, bottom, null];
      const chosen = pick(pool);
      return chosen || "";
    };

    const hakdog = (length: number) =>
      length === 1 ? small : `${start}${repeatMessage(mid, length, "")}${end}`;
    return `${marshmallow()}${hakdog(this.length)}${marshmallow()}`;
  }
}
