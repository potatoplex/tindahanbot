import { fillCircle } from "../../../../../util/CanvasUtil";
import { doRollRange } from "../../../../../util/RngUtil";
import IKape from "../../IKape";
import SauceDecorator from "./SauceDecorator";

export default class MangTomas extends SauceDecorator {
  constructor(kape: IKape, quantity: number) {
    super(kape, "Mang Tomas", "#5D4037", quantity);
  }

  async render(): Promise<void> {
    await super.render();
    const {
      bounds: {
        coordinates: [[bx1], _, [__, by3]],
        dimensions,
      },
    } = this.kape.getContainer();
    const toppingHeight =
      dimensions.height * this.getSauceHeight() * this.quantity;
    const toppingWidth = this.getContainer().bounds.dimensions.width;
    const filled = this.kape.getContentHeight() * dimensions.height;

    const x1 = bx1;
    const y1 = by3 - filled - toppingHeight;
    this.drawPepper(x1, y1, toppingWidth, toppingHeight);
  }

  drawPepper = (
    x1: number,
    y1: number,
    width: number,
    height: number
  ): void => {
    const ctx = this.kape.getContext();
    const segments = doRollRange(7, 10);
    const segmentsWidth = Math.floor(width / segments);
    const excess = width - segmentsWidth * segments;
    const padding = excess / (segments - 2);

    const w = width * 0.02;
    const h = w;

    Array(segments)
      .fill(null)
      .forEach((_, i) => {
        const baseX = x1 + segmentsWidth * i + padding;
        const x = doRollRange(baseX, baseX + segmentsWidth - w);
        const y = doRollRange(y1, y1 + height - h);
        fillCircle(ctx, x, y, w, h, "#402909");
      });
  };
}
