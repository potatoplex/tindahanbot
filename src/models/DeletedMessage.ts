import mongoose from "mongoose";

const { Schema } = mongoose;

const MODEL_NAME = "DeletedMessage";

const schema = new Schema(
  {
    content: {
      type: String,
    },
    user: {
      type: String,
    },
    channel: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model(MODEL_NAME, schema, "deletedMessages");
