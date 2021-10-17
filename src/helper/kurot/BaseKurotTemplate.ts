import { MessageAttachment, User } from "discord.js";

export default abstract class BaseKurotTemplate {
  target: User;
  nsfw = false;
  constructor(target: User, nsfw = false) {
    this.target = target;
    this.nsfw = nsfw;
  }
  abstract render(user: User): Promise<MessageAttachment>;
}
