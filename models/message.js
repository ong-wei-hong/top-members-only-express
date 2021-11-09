const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const messageSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	text: { type: String, required: true },
	datetime: { type: Date, required: true }
})

module.exports = mongoose.model('Message', messageSchema);
