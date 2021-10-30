import { fillCircle, fillRect } from "../../../../../util/CanvasUtil";
import { doRoll, doRollRange, pick } from "../../../../../util/RngUtil";
import IKape from "../../IKape";
import ToppingDecorator from "./ToppingDecorator";

export default class Sisig extends ToppingDecorator {
  constructor(kape: IKape) {
    super(kape, "Sisig");
  }

  getToppingHeight = (): number =>
    this.getContainer().trimmedDimensions.height *
    (1 - this.kape.getContentHeight());

  render = async (): Promise<void> => {
    await this.kape.render();

    const {
      bounds: {
        coordinates: [[bx1], _, [__, by3]],
        dimensions,
      },
    } = this.kape.getContainer();
    const filled = this.kape.getContentHeight() * dimensions.height;
    const toppingHeight = this.getToppingHeight();
    const toppingWidth = this.getContainer().bounds.dimensions.width;
    const baseColor = "#916643";

    const x1 = bx1;
    const y1 = by3 - filled - toppingHeight;
    const ctx = this.kape.getContext();

    fillRect(ctx, x1, y1, toppingWidth, toppingHeight, baseColor);
    this.drawPork(x1, y1, toppingWidth, toppingHeight);
    this.drawSili(x1, y1, toppingWidth, toppingHeight);
  };

  drawSili = (x1: number, y1: number, width: number, height: number): void => {
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
        fillCircle(ctx, x, y, w, h, "red");
      });
  };

  drawPork = (x1: number, y1: number, width: number, height: number): void => {
    const ctx = this.kape.getContext();
    const segments = doRollRange(15, 18);
    const segmentsWidth = Math.floor(width / segments);
    const excess = width - segmentsWidth * segments;
    const padding = excess / (segments - 2);

    const w = Math.sqrt(height ** 2 + width ** 2) * 0.06;
    const h = w;

    Array(segments)
      .fill(null)
      .forEach((_, i) => {
        const baseX = x1 + segmentsWidth * i + padding;
        const x = doRollRange(baseX, baseX + segmentsWidth - w);
        const y = doRollRange(y1, y1 + height - h);
        fillRect(
          ctx,
          x,
          y,
          w,
          h,
          pick(["#653818", "#6D5D46", "#967444"]),
          doRoll(360)
        );
      });
  };
}
