import { MessageAttachment, User } from "discord.js";
import UserImageEntry from "../image/UserImageEntry";
import ImageBuilder from "../image/ImageBuilder";
import BaseKurotTemplate from "./BaseKurotTemplate";

const BG_URL = `https://media.discordapp.net/attachments/820193847618961438/833319109563252736/31982191-siem-reap-camboya-04-de-diciembre-de-2012-niC3B1a-pellizcando-la-oreja-de-su-amiga-cerca-de.png`;

export default class GirlKurotTemplate extends BaseKurotTemplate {
  async render(user: User): Promise<MessageAttachment> {
    const authorImg = new UserImageEntry(user, 60, {
      x: 0.24,
      y: 0.22,
    });
    const targetImg = new UserImageEntry(this.target, 60, {
      x: 0.64,
      y: 0.12,
    });

    const builder = new ImageBuilder(
      { width: 450, height: 300 },
      [authorImg, targetImg],
      BG_URL
    );

    const attachment = await builder.render();

    return attachment;
  }
}
