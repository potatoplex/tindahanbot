import mongoose from 'mongoose';
const { Schema } = mongoose;

const settingsSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guild: String,
	settings: {
		prefix: String,
	},
});

export default mongoose.model('Settings', settingsSchema);
