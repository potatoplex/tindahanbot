import IKape from "../../IKape";
import SauceDecorator from "./SauceDecorator";

export default class VanillaSyrup extends SauceDecorator {
  constructor(kape: IKape, quantity: number) {
    super(kape, "Vanilla Syrup", "#F7E594", quantity);
  }
}
