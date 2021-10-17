import Client from "../helper/Client";
import MessageService from "../services/MessageService";

export default (client: Client): void => {
  client.on("messageDelete", async ({ channel, content, author }) => {
    if (channel && content && author) {
      await MessageService.addDeletedMessage({
        channel: channel.id,
        content: content,
        user: author.id,
      });
    }

    await MessageService.cleanUpDeletedMessages(channel.id);
  });
};

const config = {
  displayName: "Save Recently Deleted Messages",
  dbName: "SAVE RECENTLY DELETED MESSAGES",
};
export { config };
