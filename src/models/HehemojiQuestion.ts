import mongoose from 'mongoose';

const { Schema } = mongoose;

const MODEL_NAME = 'HehemojiQuestion';

export type HehemojiQuestionType = {
	_id: string;
	answer: string;
	producerLocation: string;
	question: string;
	category: string;
};

const schema = new Schema({
	answer: String,
	producerLocation: String,
	question: String,
	category: String,
});

export default mongoose.models[MODEL_NAME] ||
	mongoose.model(MODEL_NAME, schema, 'hehemojis');
