import IKape from "../../IKape";
import KapeDecorator from "../../KapeDecorator";

export default class ToppingDecorator extends KapeDecorator {
  constructor(kape: IKape, name: string) {
    super(kape);
    this._name = name;
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }

  getToppingHeight = (): number =>
    this.getContainer().trimmedDimensions.width * 0.2;

  getContentHeight = (): number =>
    this.kape.getContentHeight() + this.getToppingHeight();

  getToppings = (): ToppingDecorator => this;
}
