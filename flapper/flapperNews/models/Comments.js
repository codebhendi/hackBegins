var mongoose = require( 'mongoose' );

var commentSchema = new mongoose.Schema( {
	body: String,
	author: String,
	upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upvote' }],
	downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Downvote' }],
	post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }	
} );

mongoose.model('Comment', commentSchema);