var mongoose = require( 'mongoose' );

var postSchema = new mongoose.Schema( {
	author: String,
	title: String,
	link: String,
	upvotes: [{ type:mongoose.Schema.Types.ObjectId, ref: 'Upvote' }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	downvotes: [{ type:mongoose.Schema.Types.ObjectId, ref: 'Downvote'}]
} );

mongoose.model( 'Post', postSchema );