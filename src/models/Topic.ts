import mongoose from 'mongoose';

const { Schema } = mongoose;

const MODEL_NAME = 'Topic';

const schema = new Schema(
	{
		name: String,
	},
	{ timestamps: true }
);

export default mongoose.models[MODEL_NAME] ||
	mongoose.model(MODEL_NAME, schema, 'topics');
