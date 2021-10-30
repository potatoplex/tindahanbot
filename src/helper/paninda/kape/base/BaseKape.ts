import { NodeCanvasRenderingContext2D } from "canvas";
import IKape from "../IKape";
import Color from "color";
import { fillRect } from "../../../../util/CanvasUtil";
import BeverageContainer from "../container/BeverageContainer";
import SauceDecorator from "../decorator/sauce/SauceDecorator";
import ToppingDecorator from "../decorator/topping/ToppingDecorator";

export type DrinkConfig = {
  name: string;
  color?: string;
  percentage?: number;
};

export default abstract class BaseKape implements IKape {
  constructor(
    context: NodeCanvasRenderingContext2D,
    name: string,
    container: BeverageContainer,
    baseColor: string
  ) {
    this._name = name;
    this._baseColor = Color(baseColor);
    this._context = context;
    this._container = container;
  }

  getSauce(): SauceDecorator | null {
    return null;
  }
  getToppings(): ToppingDecorator | null {
    return null;
  }

  private _context: NodeCanvasRenderingContext2D;
  private _container: BeverageContainer;

  getContainer(): BeverageContainer {
    return this._container;
  }
  getContext(): NodeCanvasRenderingContext2D {
    return this._context;
  }
  getContentHeight(): number {
    return 0.75;
  }

  private _name: string;
  protected _baseColor: Color;

  public get name(): string {
    return this._name;
  }

  getBase = (): BaseKape => this;

  getDescription(): string {
    return this._name;
  }

  async draw(): Promise<void> {
    const ctx = this.getContext();

    const {
      bounds: { coordinates, dimensions },
    } = this._container;
    ctx.save();

    const [[bx1], _, [__, by3]] = coordinates;

    const x1 = bx1;
    const width = dimensions.width;
    const height = dimensions.height * this.getContentHeight();
    const y1 = by3 - height;
    // coffee
    fillRect(ctx, x1, y1, width, height, this._baseColor.hex());
  }
  async render(): Promise<void> {
    await this._container.render();
    await this.draw();
  }
}
