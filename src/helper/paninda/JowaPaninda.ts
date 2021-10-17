import { User } from "discord.js";
import { bold, mentionUser } from "../../util/MessageUtil";
import { pick } from "../../util/RngUtil";
import Paninda from "./Paninda";

export default class JowaPaninda extends Paninda {
  constructor() {
    super("Jowa 💔", ["jowa", "forever", "poreber", "toyo"], 69, 60);
  }

  successSpiel = (user: User): string => {
    const sanas = [
      "Sana all",
      "Sana naman magtagal kayo",
      "Sana mag break kayo. Salamat nalang sa lahat",
      "Sana ako nalang inorder mo.",
      "Last mo na yan ha",
      "Ako yung idineliver",
    ];

    const sana = pick(sanas);

    return `Umorder si ${mentionUser(user)} ng ${bold(`JOWA`)}. ${sana}.`;
  };

  failSpiel = (user: User): string => {
    const spiels = [
      `DI MO AFFORD MAGKAJOWA MAMIII ${mentionUser(user)}`,
      `EW MAMIII ${mentionUser(user)} WALANG JOWA`,
      `IPON KA MUNA MAMIII ${mentionUser(user)} PARA MAY PAMBILI NG JOWA`,
    ];

    return pick(spiels);
  };
}
