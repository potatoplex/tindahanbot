import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import PastokQuestion from "../../models/PastokQuestion";
import { createEmbedMessage } from "../../util/MessageUtil";
import { pick } from "../../util/RngUtil";

type RecentEntriesType = {
  _id: string;
  cooldown: number;
  name: string;
};

const RECENT_KEY = "pastokQuestions";
export default CommandBuilder.build({
  category: CommandGroup.FUN.name,
  description: "TWBA style fast talk",
  aliases: ["pt", "ft", "fasttalk"],
  slash: "both",
  expectedArgs: "<target>",
  expectedArgsTypes: ["USER"],
  init: (client) => {
    client.setRecents(RECENT_KEY, []);
  },
  callback: async ({ client, user, args, guild, member }) => {
    const recentPanindas = client.getRecents(RECENT_KEY);

    client.setRecents(
      RECENT_KEY,
      recentPanindas
        .map(({ cooldown, ...r }) => ({ cooldown: +cooldown - 1, ...r }))
        .filter(({ cooldown }) => cooldown > 0)
    );

    const count = await PastokQuestion.countDocuments();
    const cd = Math.floor(count * 0.4);

    const questions = await PastokQuestion.find({
      _id: { $nin: client.getRecents(RECENT_KEY).map(({ _id }) => _id) },
    });
    const question = pick(questions) as RecentEntriesType;

    client.addRecents(RECENT_KEY, {
      _id: question._id,
      cooldown: cd,
      name: question.name,
      userId: user.id,
    });

    const target = args[0] || user.id;

    const memberMatch =
      guild?.members.cache.find(({ user }) => user.id === target) || member;
    const nickname = memberMatch?.displayName;

    const spiel = createEmbedMessage("#0099ff", `${question.name}?`)
      .setAuthor(
        `${nickname || memberMatch?.user.username}, IKAW NA!`,
        "https://cdn.discordapp.com/attachments/765047137473265714/768419284765507634/tito_boy.png"
      )
      .setThumbnail(memberMatch.displayAvatarURL({ format: "png" }));

    return spiel;
  },
});
