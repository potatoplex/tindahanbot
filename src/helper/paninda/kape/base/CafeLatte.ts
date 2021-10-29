import { NodeCanvasRenderingContext2D } from "canvas";
import { getImage } from "../../../../util/CacheUtil";
import { fillRect } from "../../../../util/CanvasUtil";
import BeverageContainer from "../container/BeverageContainer";
import BaseKape from "./BaseKape";

const HEART_URL =
  "https://cdn.discordapp.com/attachments/765047137473265714/901466068021837824/brown_heart1.png";

export default class CafeLatte extends BaseKape {
  constructor(ctx: NodeCanvasRenderingContext2D, container: BeverageContainer) {
    super(ctx, "Cafe Latte", container, "#4E2A2A");
  }

  async draw(): Promise<void> {
    const ctx = this.getContext();

    const { bounds } = this.getContainer();

    ctx.save();

    const [[bx1], _, [__, by3]] = bounds.coordinates;

    const allottedHeight = bounds.dimensions.height * this.getContentHeight();
    const coffeeHeight = allottedHeight * 0.4;

    const x1 = bx1;
    const y1 = by3 - coffeeHeight;
    const width = bounds.dimensions.width;

    // espresso
    fillRect(ctx, x1, y1, width, coffeeHeight, this._baseColor.hex());

    const creamColor = "#FFFCC9";

    // cream
    const topperHeight = allottedHeight - coffeeHeight;
    const fy1 = y1 - topperHeight;
    fillRect(ctx, x1, fy1, width, topperHeight, creamColor);

    const padding = {
      x: width * 0.1,
      y: topperHeight * 0.1,
    };

    const heartWidth = width * 0.8;
    const heartHeight = topperHeight * 0.8;

    await this.drawHeart(
      x1 + +(width - heartWidth) * 0.5,
      fy1 + padding.y,
      heartWidth,
      heartHeight
    );
  }

  async drawHeart(
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    const heart = await getImage(HEART_URL);

    const ctx = this.getContext();

    ctx.drawImage(heart, x, y, width, height);
  }
}
