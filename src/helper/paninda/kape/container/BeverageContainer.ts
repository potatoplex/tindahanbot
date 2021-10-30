import { NodeCanvasRenderingContext2D } from "canvas";
import { getImage } from "../../../../util/CacheUtil";
import { pick } from "../../../../util/RngUtil";
import { Coordinates, Dimensions } from "../../../image/ImageBuilder";
import BeverageSize from "./size/BeverageSize";

type Bounds = {
  dimensions: Dimensions;
  coordinates: [
    [number, number],
    [number, number],
    [number, number],
    [number, number]
  ];
};

export default abstract class BeverageContainer {
  private _url: string;

  constructor(
    context: NodeCanvasRenderingContext2D,
    url: string,
    size: BeverageSize
  ) {
    this._url = url;
    this._context = context;
    this._size = size;
  }

  private _context: NodeCanvasRenderingContext2D;
  private _size: BeverageSize;

  public get size(): BeverageSize {
    return this._size;
  }

  public get dimensions(): Dimensions {
    const { width: canvasWidth, height: canvasHeight } = this._context.canvas;
    const { scale } = this._size;
    return {
      width: canvasWidth * scale,
      height: canvasHeight * scale,
    };
  }

  public abstract get origin(): Coordinates;

  public get url(): string {
    return this._url;
  }

  public get trimmedDimensions(): Dimensions {
    const {
      canvas: { width, height },
    } = this._context;
    return {
      width,
      height,
    };
  }

  public get margin(): Coordinates {
    return { x: 0, y: 0 };
  }

  public get bounds(): Bounds {
    const {
      origin,
      trimmedDimensions: { width, height },
      margin,
      padding,
    } = this;

    const { x: px, y: py } = padding;

    const x1 = origin.x + margin.x + px;
    const y1 = origin.y + margin.y + py;
    const x2 = x1 + width - 2 * px;
    const y2 = y1;
    const x3 = x2;
    const y3 = y2 + height - 2 * py;
    const x4 = x1;
    const y4 = y3;

    return {
      dimensions: {
        width: x2 - x1,
        height: y3 - y2,
      },
      coordinates: [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x4, y4],
      ],
    };
  }

  public get padding(): Coordinates {
    const { width, height } = this.trimmedDimensions;
    return {
      x: width * 0.08,
      y: height * 0.05,
    };
  }
  public get context(): NodeCanvasRenderingContext2D {
    return this._context;
  }

  async render(): Promise<void> {
    const {
      origin: { x, y },
      dimensions: { width, height },
      url,
    } = this;

    const ctx = this._context;

    const { width: canvasWidth, height: canvasHeight } = ctx.canvas;

    const bgColor = pick([
      "#FFCDD2",
      "#F8BBD0",
      "#E1BEE7",
      "#D1C4E9",
      "#C5CAE9",
      "#BBDEFB",
      "#B3E5FC",
      "#B2EBF2",
      "#B2DFDB",
      "#C8E6C9",
      "#DCEDC8",
      "#F0F4C3",
      "#FFF9C4",
      "#FFECB3",
      "#FFE0B2",
      "#FFCCBC",
      "#D7CCC8",
      "#D7CCC8",
      "#CFD8DC",
    ]);

    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    const background = await getImage(url);
    ctx.drawImage(background, x, y, width, height);
  }
}
