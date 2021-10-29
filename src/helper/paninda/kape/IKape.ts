import { NodeCanvasRenderingContext2D } from "canvas";
import BaseKape from "./base/BaseKape";
import BeverageContainer from "./container/BeverageContainer";
import SauceDecorator from "./decorator/sauce/SauceDecorator";
import ToppingDecorator from "./decorator/topping/ToppingDecorator";

export default interface IKape {
  getBase(): BaseKape;
  getSauce(): SauceDecorator | null;
  getToppings(): ToppingDecorator | null;
  getDescription(): string;
  getContainer(): BeverageContainer;
  getContext(): NodeCanvasRenderingContext2D;
  getContentHeight(): number;
  render(): Promise<void> | void;
}
