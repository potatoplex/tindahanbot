import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import Topic from "../../models/Topic";
import { createEmbedMessage } from "../../util/MessageUtil";
import { pick } from "../../util/RngUtil";

type RecentEntriesType = {
  _id: string;
  cooldown: number;
  name: string;
  userId: string;
};

export default CommandBuilder.build({
  category: CommandGroup.FUN.name,
  aliases: ["paksa", "topic"],
  description: "Humingi ng topic kay ni Aling Nena",
  slash: "both",
  cooldown: "10s",
  init: (client) => {
    client.setRecents("topics", []);
  },
  callback: async ({ client, user }) => {
    const RECENT_KEY = "topics";
    const recentTopics = client.getRecents(RECENT_KEY);

    client.setRecents(
      RECENT_KEY,
      recentTopics
        .map(({ cooldown, ...r }) => ({ cooldown: +cooldown - 1, ...r }))
        .filter(({ cooldown }) => cooldown > 0)
    );

    const count = await Topic.countDocuments();
    const cd = Math.floor(count * 0.4);

    const topics = await Topic.find({
      _id: { $nin: client.getRecents(RECENT_KEY).map(({ _id }) => _id) },
    });
    const topic = pick(topics) as RecentEntriesType;

    client.addRecents(RECENT_KEY, {
      _id: topic._id,
      cooldown: cd,
      name: topic.name,
      userId: user.id,
    });

    return createEmbedMessage("RANDOM").setDescription(topic.name);
  },
});
