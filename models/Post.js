const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	}
}, {_id: false});

const CommentSchema = {
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	text: {
		type: String,
		required: true
	},
	name: String,
	avatar: String,
	date: {
		type: Date,
		default: Date.now
	}
}

const PostSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	text: {
		type: String,
		required: true
	},
	//We want to leave messages if user deletes his account
	name: String,
	avatar: String,
	likes: {
		required: true,
		type: [LikeSchema]
	},
	comments: {
		required: true,
		type: [CommentSchema]
	}
});

PostSchema.methods.like = function(req) { 
	this.likes.unshift({ userId: req.user._id });
};
PostSchema.methods.unlike = function(req, index) {
	this.likes.splice(index, 1);
}

module.exports = mongoose.model('posts', PostSchema);