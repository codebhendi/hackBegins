var mongoose = require( 'mongoose' );

var upvoteSchema = new mongoose.Schema( {
	upvote: { type: Number, default: 0 },
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
	comments: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }	
} );

mongoose.model( 'Upvote', upvoteSchema );