import { NodeCanvasRenderingContext2D } from "canvas";
import BeverageContainer from "../container/BeverageContainer";
import BaseKape from "./BaseKape";

export default class KapeBarako extends BaseKape {
  constructor(ctx: NodeCanvasRenderingContext2D, container: BeverageContainer) {
    super(ctx, "Kape Barako", container, "#362419");
  }
}
