import { fillCircle, fillRect } from "../../../../../util/CanvasUtil";
import { doRoll, doRollRange, pick } from "../../../../../util/RngUtil";
import IKape from "../../IKape";
import ToppingDecorator from "./ToppingDecorator";

export default class DolomiteSand extends ToppingDecorator {
  constructor(kape: IKape) {
    super(kape, "Dolomite Sand");
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
    const baseColor = "#c2b280";

    const x1 = bx1;
    const y1 = by3 - filled - toppingHeight;
    const ctx = this.kape.getContext();

    fillRect(ctx, x1, y1, toppingWidth, toppingHeight, baseColor);
    this.drawSpecs(x1, y1, toppingWidth, toppingHeight);
  };

  drawSpecs = (x1: number, y1: number, width: number, height: number): void => {
    const ctx = this.kape.getContext();
    const segments = doRollRange(15, 20);
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
        fillCircle(ctx, x, y, w, h, pick(["#382A06", "#D1A841", "#FFFCC9"]));
      });
  };
}
