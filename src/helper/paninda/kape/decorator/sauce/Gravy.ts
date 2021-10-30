import IKape from "../../IKape";
import SauceDecorator from "./SauceDecorator";

export default class Gravy extends SauceDecorator {
  constructor(kape: IKape, quantity: number) {
    super(kape, "Gravy", "#86644f", quantity);
  }
}
