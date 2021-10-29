import { NodeCanvasRenderingContext2D } from "canvas";
import { fillRect } from "../../../../util/CanvasUtil";
import BeverageContainer from "../container/BeverageContainer";
import BaseKape from "./BaseKape";

export default class CaramelMacchiato extends BaseKape {
  constructor(ctx: NodeCanvasRenderingContext2D, container: BeverageContainer) {
    super(ctx, "Caramel Macchiato", container, "#E2BB7B");
  }
  async draw(): Promise<void> {
    const ctx = this.getContext();

    const { bounds } = this.getContainer();

    ctx.save();

    const [[bx1], _, [__, by3]] = bounds.coordinates;

    const allottedHeight = bounds.dimensions.height * this.getContentHeight();
    const coffeeHeight = allottedHeight * 0.8;

    const x1 = bx1;
    const width = bounds.dimensions.width;
    const y1 = by3 - coffeeHeight;

    // coffee
    fillRect(ctx, x1, y1, width, coffeeHeight, this._baseColor.hex());

    // froth
    const topperHeight = (allottedHeight - coffeeHeight) * 0.5;
    const fy1 = y1 - topperHeight;
    fillRect(ctx, x1, fy1, width, topperHeight, "#FEFBEA");

    // caramel
    const cy1 = fy1 - topperHeight;
    fillRect(ctx, x1, cy1, width, topperHeight, "#B67233");
  }
}
