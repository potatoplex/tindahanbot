import { NodeCanvasRenderingContext2D } from "canvas";
import { fillRect } from "../../../../util/CanvasUtil";
import BeverageContainer from "../container/BeverageContainer";
import BaseKape from "./BaseKape";

export default class ThreeInOne extends BaseKape {
  constructor(ctx: NodeCanvasRenderingContext2D, container: BeverageContainer) {
    super(ctx, "3 in 1 Coffee", container, "#4E2A2A");
  }
  async draw(): Promise<void> {
    const ctx = this.getContext();

    const { bounds } = this.getContainer();

    ctx.save();

    const [[bx1], _, [__, by3]] = bounds.coordinates;

    const allottedHeight = bounds.dimensions.height * this.getContentHeight();
    const layerHeight = allottedHeight / 3;

    const x1 = bx1;
    const width = bounds.dimensions.width;

    const milk = "#FFFCC9";
    const sugar = "#E6E6D5";
    [this._baseColor.hex(), sugar, milk].forEach((c, i) => {
      fillRect(ctx, x1, by3 - layerHeight * (i + 1), width, layerHeight, c);
    });
  }
}
