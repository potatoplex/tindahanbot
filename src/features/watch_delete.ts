import Client from "../helper/Client";
import MessageService, { DeletedMessageType } from "../services/MessageService";

export default (client: Client): void => {
  client.on("messageDelete", async (message) => {
    const { channel, content, author, attachments, embeds } = message;

    console.log(JSON.stringify(message));

    const hasContent = !!content;
    const hasAttachments = !!attachments.first();
    const hasEmbeds = embeds.length > 0;

    if (channel && (hasContent || hasAttachments || hasEmbeds) && author) {
      const body: Omit<DeletedMessageType, "createdAt"> = {
        channel: channel.id,
        user: author.id,
      };

      if (content) {
        if (hasEmbeds && embeds[0]?.url) {
          const [{ url }] = embeds;
          const c = content.trim() || undefined;
          body.attachment = url;
          body.content = c;
        } else {
          body.content = content;
        }
      }
      if (attachments.first()) {
        body.attachment = attachments.first()?.proxyURL;
      }
      await MessageService.addDeletedMessage(body);
    }

    await MessageService.cleanUpDeletedMessages(channel.id);
  });
};

const config = {
  displayName: "Save Recently Deleted Messages",
  dbName: "SAVE RECENTLY DELETED MESSAGES",
};
export { config };
