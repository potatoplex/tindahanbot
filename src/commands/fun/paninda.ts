import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import Paninda from "../../models/Paninda";
import PanindaReklamo from "../../models/PanindaReklamo";
import { createEmbedMessage, mentionUser } from "../../util/MessageUtil";
import { pick, rateRoll } from "../../util/RngUtil";

type RecentPanindaType = {
  _id: string;
  cooldown: number;
  name: string;
  userId: string;
};

export type PanindaReklamoType = {
  _id: string;
  name: string;
};

const RECENT_KEY = "panindas";
export default CommandBuilder.build({
  category: CommandGroup.FUN.name,
  description: "Bumili ng paninda sa Tindahan ni Aling Nena",
  slash: "both",
  cooldown: "10s",
  init: (client) => {
    client.setRecents(RECENT_KEY, []);
  },
  callback: async ({ client, user }) => {
    const recentPanindas = client.getRecents(RECENT_KEY);

    client.setRecents(
      RECENT_KEY,
      recentPanindas
        .map(({ cooldown, ...r }) => ({ cooldown: +cooldown - 1, ...r }))
        .filter(({ cooldown }) => cooldown > 0)
    );

    const count = await Paninda.countDocuments();
    const cd = Math.floor(count * 0.4);

    const panindas = await Paninda.find({
      _id: { $nin: client.getRecents(RECENT_KEY).map(({ _id }) => _id) },
    });
    const paninda = pick(panindas) as RecentPanindaType;

    client.addRecents(RECENT_KEY, {
      _id: paninda._id,
      cooldown: cd,
      name: paninda.name,
      userId: user.id,
    });

    const purchaseCounter: Record<string, number> = client
      .getRecents(RECENT_KEY)
      .reduce((prev: { [key: string]: number }, next) => {
        const prevCount = prev[next.userId] || 0;
        return { ...prev, [next.userId]: +prevCount + 1 };
      }, {});

    if (purchaseCounter[user.id] >= Math.floor(cd / 4) && rateRoll(50)) {
      const reklamos: PanindaReklamoType[] = await PanindaReklamo.find({});
      const reklamo = pick(reklamos.map((r) => r.name));
      return createEmbedMessage("RANDOM").setDescription(
        reklamo.replace("{user}", mentionUser(user))
      );
    }
    const embed = createEmbedMessage("RANDOM").setDescription(paninda.name);

    return embed;

    return createEmbedMessage("RANDOM").setDescription(paninda.name);
  },
});
