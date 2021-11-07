import Color from "color";
import { fillCircle, fillRect } from "../../../../../util/CanvasUtil";
import randomAngle, {
  doRoll,
  doRollRange,
  pick,
} from "../../../../../util/RngUtil";
import IKape from "../../IKape";
import ToppingDecorator from "./ToppingDecorator";

export default class Pasas extends ToppingDecorator {
  constructor(kape: IKape) {
    super(kape, "Pasas");
  }

  getToppingHeight = (): number =>
    this.getContainer().trimmedDimensions.width * 0.08;

  render = async (): Promise<void> => {
    await this.kape.render();
    const baseColor = "#612302";
    const {
      bounds: {
        coordinates: [[bx1], _, [__, by3]],
        dimensions,
      },
    } = this.kape.getContainer();
    const filled = this.kape.getContentHeight() * dimensions.height;
    const toppingHeight = this.getToppingHeight();
    const toppingWidth = toppingHeight * 0.7;

    const x1 = bx1;
    const y1 = by3 - filled - toppingHeight + dimensions.height * 0.03;

    const w = dimensions.width * 0.96;
    const count = Math.floor(w / toppingHeight);
    const ctx = this.kape.getContext();

    const remaining = w - w / toppingHeight;
    const padding = remaining / (count - 1);

    Array(count)
      .fill(null)
      .forEach((_, i) => {
        const x = x1 + i * toppingHeight + padding;
        const y = y1 + toppingHeight * (doRollRange(0, 30) / 100);

        ctx.save();
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.ellipse(
          x,
          y,
          toppingWidth,
          toppingHeight,
          randomAngle(),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.strokeStyle = Color(baseColor).darken(0.6).hex();
        ctx.stroke();
      });

    Array(doRollRange(2, 3))
      .fill(null)
      .forEach(() => {
        const y = y1;
        ctx.save();

        const jitter = {
          x: doRoll(Math.floor(toppingHeight * 0.3)),
          y:
            (doRoll(1) > 0 ? 1 : -1) *
            (doRollRange(10, 25) / 100) *
            toppingHeight,
        };

        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.ellipse(
          doRollRange(x1 * 1.02, x1 + w - toppingHeight),
          y + jitter.y,
          toppingWidth,
          toppingHeight,
          randomAngle(),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.strokeStyle = Color(baseColor).darken(0.6).hex();
        ctx.stroke();
        ctx.restore();
      });
  };

  drawPasas = (x1: number, y1: number, width: number, height: number): void => {
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
