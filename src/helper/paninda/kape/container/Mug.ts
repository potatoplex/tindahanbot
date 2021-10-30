import { NodeCanvasRenderingContext2D } from "canvas";
import { Coordinates, Dimensions } from "../../../image/ImageBuilder";
import BeverageContainer from "./BeverageContainer";
import BeverageSize from "./size/BeverageSize";

const BG_IMG =
  "https://media.discordapp.net/attachments/765047137473265714/901368924363423754/Kj_LcQHli99OUGELfHF9kMXgrGkaPUBZ0JyRS2NVzQFF8ieWn93bXN1vYoDRJGNWadr34naBvH25jfEehIBWa4vu3MwT4nStGzW6Kao0X3tbh2H0WH3cZ5a2pdp_nBNnEkPD-Htk1XslYJIug2k.png";

export default class Mug extends BeverageContainer {
  constructor(context: NodeCanvasRenderingContext2D, size: BeverageSize) {
    super(context, BG_IMG, size);
  }

  public get origin(): Coordinates {
    const { width: canvasWidth, height: canvasHeight } = this.context.canvas;
    const { scale } = this.size;
    const width = canvasWidth * scale;
    const height = canvasHeight * scale;

    const floor = canvasHeight * 0.95;

    return {
      x: (canvasWidth - width) * 0.5,
      y: floor - height,
    };
  }

  public get trimmedDimensions(): Dimensions {
    const { width, height } = this.dimensions;
    return {
      width: width * 0.57,
      height: height * 0.73,
    };
  }

  public get margin(): Coordinates {
    const { width: containerWidth, height: containerHeight } = this.dimensions;
    return { x: containerWidth * 0.15, y: containerHeight * 0.13 };
  }
}
