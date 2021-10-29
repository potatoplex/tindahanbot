import { rotateImg } from "../../../../../util/CanvasUtil";
import randomAngle, { doRoll, doRollRange } from "../../../../../util/RngUtil";
import IKape from "../../IKape";
import ToppingDecorator from "./ToppingDecorator";
import { getImage } from "../../../../../util/CacheUtil";

const IMG_URL =
  "https://cdn.discordapp.com/attachments/765047137473265714/903632997696294942/siomai.png";

export default class SiomaiTopping extends ToppingDecorator {
  constructor(kape: IKape) {
    super(kape, "Siomai");
  }

  getToppingHeight = (): number =>
    this.getContainer().trimmedDimensions.width * 0.25;

  render = async (): Promise<void> => {
    await this.kape.render();
    const siomai = await getImage(IMG_URL);

    const {
      bounds: {
        coordinates: [[bx1], _, [__, by3]],
        dimensions,
      },
    } = this.kape.getContainer();
    const filled = this.kape.getContentHeight() * dimensions.height;
    const toppingHeight = this.getToppingHeight();
    const toppingWidth = toppingHeight;

    const x1 = bx1;
    const y1 = by3 - filled - toppingHeight + dimensions.height * 0.1;

    const count = Math.floor(dimensions.width / toppingWidth);
    const ctx = this.kape.getContext();

    const remaining = dimensions.width - toppingWidth * count;
    const padding = remaining / (count - 1);

    Array(count)
      .fill(null)
      .forEach((_, i) => {
        const x = x1 + i * toppingWidth + padding;
        const y = y1;

        ctx.save();

        const p = rotateImg(siomai, randomAngle());

        ctx.drawImage(p, x, y, toppingWidth, toppingHeight);

        ctx.restore();
      });

    Array(doRollRange(1, 3))
      .fill(null)
      .forEach(() => {
        const y = y1;
        ctx.save();
        const p = rotateImg(siomai, randomAngle());

        const jitter = {
          x: doRoll(Math.floor(toppingWidth * 0.3)),
          y:
            (doRoll(1) > 0 ? 1 : -1) *
            (doRollRange(10, 25) / 100) *
            toppingHeight,
        };
        ctx.drawImage(
          p,
          doRollRange(x1, x1 + dimensions.width - toppingWidth),
          y + jitter.y,
          toppingWidth,
          toppingHeight
        );
        ctx.restore();
      });
  };
}
