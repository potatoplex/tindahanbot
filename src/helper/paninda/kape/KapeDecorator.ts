import { NodeCanvasRenderingContext2D } from "canvas";
import BaseKape from "./base/BaseKape";
import BeverageContainer from "./container/BeverageContainer";
import SauceDecorator from "./decorator/sauce/SauceDecorator";
import ToppingDecorator from "./decorator/topping/ToppingDecorator";
import IKape from "./IKape";

export default abstract class KapeDecorator implements IKape {
  protected kape: IKape;

  constructor(kape: IKape) {
    this.kape = kape;
  }

  getBase(): BaseKape {
    return this.kape.getBase();
  }
  getSauce(): SauceDecorator | null {
    return this.kape.getSauce();
  }
  getToppings(): ToppingDecorator | null {
    return this.kape.getToppings();
  }

  getDescription(): string {
    return this.kape.getDescription();
  }

  getContainer(): BeverageContainer {
    return this.kape.getContainer();
  }

  getContext(): NodeCanvasRenderingContext2D {
    return this.kape.getContext();
  }

  getContentHeight(): number {
    return this.kape.getContentHeight();
  }

  render(): void | Promise<void> {
    return this.kape.render();
  }
}
