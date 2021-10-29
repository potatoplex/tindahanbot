import IKape from "../../IKape";
import SauceDecorator from "./SauceDecorator";

export default class Ketchup extends SauceDecorator {
  constructor(kape: IKape, quantity: number) {
    super(kape, "Banana Ketchup", "#CD001A", quantity);
  }
}
