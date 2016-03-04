var mongoose = require( 'mongoose' );

var postSchema = new mongoose.Schema( {
	author: String,
	title: String,
	link: String,
	upvotes: { type: Number, default: 0 },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
} );

mongoose.model( 'Post', postSchema );