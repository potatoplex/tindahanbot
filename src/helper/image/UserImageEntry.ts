import { CanvasRenderingContext2D } from "canvas";
import { AllowedImageSize, User } from "discord.js";
import { getImage } from "../../util/CacheUtil";
import { ImageEntry, Dimensions, Coordinates } from "./ImageBuilder";

export default class UserImageEntry extends ImageEntry {
  constructor(
    user: User,
    width: number,
    public coordinates: Coordinates,
    public round: boolean = true,
    public size: AllowedImageSize = 256
  ) {
    super(
      user.displayAvatarURL({ format: "png", size }),
      { width, height: width },
      coordinates,
      round
    );
  }
  async render(
    ctx: CanvasRenderingContext2D,
    containerDims: Dimensions
  ): Promise<void> {
    const { width: cWidth, height: cHeight } = containerDims;
    const { x: pX, y: pY } = this.coordinates;
    const { width, height } = this.dimensions;
    const x = pX * cWidth;
    const y = pY * cHeight;

    if (this.round) {
      this.roundCorners(ctx, { x, y }, this.dimensions);
    }
    const image = await getImage(this.image);
    ctx.drawImage(image, x, y, width, height);
  }
}
