import IKape from "../../IKape";
import SauceDecorator from "./SauceDecorator";

export default class MangTomas extends SauceDecorator {
  constructor(kape: IKape, quantity: number) {
    super(kape, "Mang Tomas", "#5D4037", quantity);
  }
}
