import { NodeCanvasRenderingContext2D } from "canvas";
import { fillRect } from "../../../../util/CanvasUtil";
import BeverageContainer from "../container/BeverageContainer";
import BaseKape from "./BaseKape";

export default class MatchaLatte extends BaseKape {
  constructor(ctx: NodeCanvasRenderingContext2D, container: BeverageContainer) {
    super(ctx, "Matcha Latte", container, "#91B500");
  }

  async draw(): Promise<void> {
    const ctx = this.getContext();

    const { bounds } = this.getContainer();

    ctx.save();

    const [[bx1], _, [__, by3]] = bounds.coordinates;

    const allottedHeight = bounds.dimensions.height * this.getContentHeight();
    const coffeeHeight = allottedHeight * 0.9;

    const x1 = bx1;
    const width = bounds.dimensions.width;
    const y1 = by3 - coffeeHeight;

    // matcha
    fillRect(ctx, x1, y1, width, coffeeHeight, this._baseColor.hex());

    // foam
    const topperHeight = allottedHeight - coffeeHeight;
    const fy1 = y1 - topperHeight;
    fillRect(ctx, x1, fy1, width, topperHeight, "#FEFBEA");
  }
}
