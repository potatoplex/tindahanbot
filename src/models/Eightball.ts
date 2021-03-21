import mongoose from 'mongoose';

const { Schema } = mongoose;

const MODEL_NAME = 'EightBall';

const schema = new Schema({
	name: String,
});

export default mongoose.models[MODEL_NAME] ||
	mongoose.model(MODEL_NAME, schema, '8ball');
