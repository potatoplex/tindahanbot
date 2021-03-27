import mongoose from 'mongoose';

const { Schema } = mongoose;

export type PanindaReklamoType = {
	_id: string;
	name: string;
};

const MODEL_NAME = 'PanindaReklamo';

const schema = new Schema({
	name: String,
});

export default mongoose.models[MODEL_NAME] ||
	mongoose.model(MODEL_NAME, schema, 'panindaReklamos');
