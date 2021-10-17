import config from "../../config";
import DiscordApiService, { Member } from "../../services/DiscordApiService";
import CommandGroup from "../../enums/CommandGroup";
import CommandBuilder from "../../helper/CommandBuilder";
import { createEmbedMessage, mentionUser } from "../../util/MessageUtil";

export default CommandBuilder.build({
  category: CommandGroup.MOD.name,
  aliases: ["inac"],
  description: "List Inactive Members",
  slash: false,
  guildOnly: true,
  ownerOnly: true,
  hidden: true,
  callback: async ({ guild }) => {
    const discordApiService = new DiscordApiService();

    const { baseRole = "", activityRoles = [] } = config.commands.inactive;
    const members = await discordApiService.getMembersByRoleId(
      guild!.id,
      baseRole
    );

    const inactive = members.filter(
      ({ roles }) => !roles.some((role) => activityRoles.includes(role))
    );

    const out = inactive.map((m: Member) => mentionUser(m.user.id)).join("\n");
    const embed = createEmbedMessage()
      .setTitle(`Inactive Users (${inactive.length})`)
      .setDescription(inactive.length > 0 ? out : "None");

    return embed;
  },
});
