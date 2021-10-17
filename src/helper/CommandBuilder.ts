import WOKCommands, { ICallbackObject, ICommand } from "wokcommands";
import config from "../config";
import Client from "./Client";

const defaultValues = {
  testOnly: config.testOnly,
};

type TOptions = Omit<ICommand, "callback"> & {
  init?: (client: Client, instance: WOKCommands) => void;
  callback: (obj: ICallbackObject & { client: Client }) => any;
};

export default abstract class CommandBuilder {
  static build(options: TOptions): TOptions {
    return {
      ...defaultValues,
      ...options,
    };
  }
}
