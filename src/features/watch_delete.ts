import Client from "../helper/Client";
import MessageService, { DeletedMessageType } from "../services/MessageService";

export default (client: Client): void => {
  client.on(
    "messageDelete",
    async ({ channel, content, author, attachments }) => {
      console.log(JSON.stringify(attachments.first() || ""));

      if (channel && (content || attachments.first()) && author) {
        const body: Omit<DeletedMessageType, "createdAt"> = {
          channel: channel.id,
          user: author.id,
        };

        if (content) {
          body.content = content;
        }
        if (attachments.first()) {
          body.attachment = attachments.first()?.proxyURL;
        }
        await MessageService.addDeletedMessage(body);
      }

      await MessageService.cleanUpDeletedMessages(channel.id);
    }
  );
};

const config = {
  displayName: "Save Recently Deleted Messages",
  dbName: "SAVE RECENTLY DELETED MESSAGES",
};
export { config };
