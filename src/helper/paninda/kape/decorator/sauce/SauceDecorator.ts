import Color from "color";
import { fillRect, strokeRect } from "../../../../../util/CanvasUtil";
import IKape from "../../IKape";
import KapeDecorator from "../../KapeDecorator";

export default abstract class SauceDecorator extends KapeDecorator {
  private _quantity: number;
  private _sauceName: string;
  private _color: Color;

  constructor(kape: IKape, name: string, color: string, quantity: number) {
    super(kape);
    this._quantity = quantity;
    this._sauceName = name;
    this._color = Color(color);
  }

  getSauceHeight(): number {
    return 0.05;
  }

  getContentHeight(): number {
    return (
      this.kape.getContentHeight() + this._quantity * this.getSauceHeight()
    );
  }

  public get name(): string {
    return this._sauceName;
  }
  public get quantity(): number {
    return this._quantity;
  }

  toString = (): string => {
    if (!this._quantity || !this._sauceName) return "";

    const pump = `pump${this._quantity > 1 ? "s" : ""}`;
    const spiel = `with ${this._quantity} ${pump} of ${this._sauceName}`;
    return spiel;
  };

  getSauce = (): SauceDecorator => {
    return this;
  };

  async render(): Promise<void> {
    await this.kape.render();
    const { bounds } = this.kape.getContainer();

    const syrupHeight = bounds.dimensions.height * this.getSauceHeight();
    const [[bx1], _, [__, by3]] = bounds.coordinates;
    const x1 = bx1;
    const y1 =
      by3 -
      this.kape.getContentHeight() * bounds.dimensions.height -
      syrupHeight * this._quantity;

    const width = bounds.dimensions.width;
    const color = this._color;
    fillRect(
      this.kape.getContext(),
      x1,
      y1,
      width,
      syrupHeight * this._quantity,
      color.hex()
    );

    Array(this._quantity)
      .fill(null)
      .forEach((_, i) => {
        strokeRect(
          this.kape.getContext(),
          x1,
          y1 + i * syrupHeight,
          width,
          syrupHeight,
          color.darken(0.1).hex()
        );
      });
  }
}
