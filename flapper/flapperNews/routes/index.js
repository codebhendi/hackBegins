var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var Post = mongoose.model( 'Post' );
var Comment = mongoose.model( 'Comment' );
var passport = require( 'passport' );
var User = mongoose.model( 'User' );
var jwt = require('express-jwt');
var Upvote = mongoose.model( 'Upvote' );
var Downvote = mongoose.model( 'Downvote' );
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var auth = jwt( {secret: 'SECRET', userProperty: 'payload'} );

router.get( '/posts', function ( req, res, next ) {
	Post.find( function ( err, posts ) {
		if ( err ) {
			return next( err );
		}

		res.json( posts );
	} );
} );

router.post( '/posts', auth, function ( req, res, next ) {
	var post = new Post( req.body );
	post.author = req.payload.username;
	post.save( function ( err, post ) {
		if ( err ) {
			return next( err );
		}

		res.json( post );
	} );
} );

router.param( 'post', function ( req, res, next, id ) {
	var query = Post.findById( id );
	query.exec( function ( err, post ) {
		if ( err ) {
			return next( err );
		}

		if ( !post ) {
			return next ( new Error( "Can't find post" ) );	
		}

		req.post = post;
		return next();
	} );
	
} );

router.get( '/posts/:post', function ( req, res, next ) {
	req.post.populate( 'comments', function( err, post ) {
		if ( err ) {
			return next( err );
		}

		res.json( post );		
	} );

} );


// Function to upvote a post
// For this we are fist checking
// if a user has already upvoted this or not
router.put( '/posts/:post/upvote', auth, function ( req, res, next ) {
	// Use findOne method to search for the user
	// for this particular post
	Upvote.findOne( 
		{user: req.payload, post: req.post},
		function( err, upvote1 ) {
			// return if found an error
			if ( err ) {
				return next(err);
			}
			// if found an upvote
			// it means user already has upvoted
			if ( upvote1 ) {
				return next( null, false );
			}
			// User has not upvoted create a new
			// upvote
			var upvote = new Upvote();
			// set the value to one
			// store the userId and also
			// the postId
			upvote.upvote = 1;
			upvote.user = req.payload;
			upvote.post = req.post;
			//call the save function to save this
			// upvote
			upvote.save( function( err, upvote ) {
				//return if error
				if ( err ) {
					return next( err );
				}
				// add the upvote to post
				// then save the post.
				req.post.upvotes++;
				
				req.post.save( function( err, post ) {
					if ( err ) {
						next( err );
					}
					res.json( post );
				} );
			});
		}
	);
} );


// Function to upvote a post
// all implementaion same as dupvote.
// use collection named downvotes to store
// downvotes and decrease one upvote from
// post.upvotes.
router.put( '/posts/:post/downvote', auth, function ( req, res, next ) {
	Downvote.findOne( 
		{user: req.payload, post: req.post},
		function( err, downvote1 ) {
			if ( err ) {
				return next(err);
			}
			if ( downvote1 ) {
				return next( null, false );
			}
			var downvote = new Downvote();
			downvote.downvote = 1;
			downvote.user = req.payload;
			downvote.post = req.post;
			downvote.save( function( err, downvote ) {
				if ( err ) {
					return next( err );
				}
				req.post.upvotes--;
				
				req.post.save( function( err, post ) {
					if ( err ) {
						return next( err );
					}

					res.json( post );
				} );
			} );
		}
	);
} );

// Function to create new comments for a post
// Takes the route '/post/:post/comments'
// where :post will be the id of post
// for which we are writing new comments
router.post( '/posts/:post/comments', auth, function ( req, res, next ) {
	// create new comments using the
	// data provided in the request
	var comment = new Comment( req.body );
	
	// To store the id of the post
	// for which this post has been written
	// then store the author name for that post
	comment.post = req.post;
	comment.author = req.payload.username;

	//save the comment on the collection comments
	comment.save( function ( err, comment ) {
		// return the error if their is one
		// while saving the comment
		if ( err ) {
			return next( err );
		}

		// Push the comment to the post's
		// comments array
		req.post.comments.push( comment );
		// Save the post and call error if there is
		// one
		req.post.save( function( err, save ) {
			if ( err ) {
				return next( err );
			}
			res.json( save );
		} );
	} );

} );

// This is where we detect the comment 
// parameter in the route and
// call this function
// Used to get comments
router.param( 'comment', function ( req, res, next, id ) {
	//Comment to find the
	// comments represented by the id
	var query = Comment.findById( id );

	// Execute the query,
	// If error return the erro,
	// if not and there is no comment 
	// retur a null message,
	// if found return the comment
	// and call the next route
	query.exec( function ( err, comment ) {
		if ( err ) {
			return next( err );
		}

		if ( !comment ) {
			return next( new Error("can't find comment" ) );
		}

		req.comment = comment;
		return next();
	} );
} );


// Function or route to upvote a comment.
// It is similar to upvote but only the commit
// field will be updated in the upvote.
router.put( '/posts/:post/comments/:comment/upvote', auth, function ( req, res, next ) {
	Upvote.findOne( 
		{user: req.payload, comments: req.comment}, 
		function( err, upvote1 ) {
			if ( err ) {
				return next( err );
			}

			if ( upvote1 ) {
				//console.log(1);
				return next( null, false );
			}

			var upvote = new Upvote();
			upvote.upvote  = 1;
			upvote.comments = req.comment;
			upvote.user = req.payload;

			upvote.save( function( err, upvote ) {
				if ( err ) {
				return next( err );
				}					
				req.comment.upvotes++;
				
				req.comment.save( function( err, comment ) {
					if ( err ) {
						return next( err );
					}
					res.json( comment );
				} );
			} );
		}
	);
} );


// Function or route to downvote a comment
// of a post, similar to upvote of comment.
router.put( '/posts/:post/comments/:comment/downvote', auth, function ( req, res, next ) {
	Downvote.findOne( 
		{user: req.payload, comments: req.comment}, 
		function( err, downvote1 ) {
			if ( err ) {
				return next( err );
			}

			if ( downvote1 ) {
				return next( null, false );
			}

			var downvote = new Downvote();
			downvote.downvote = 1;
			downvote.comments = req.comment;
			downvote.user = req.payload;

			downvote.save( function( err, downvote ) {
				if ( err ) {
				return next( err );
				}

				req.comment.upvotes--;
				
				req.comment.save( function( err, comment ) {
					if ( err ) {
						return next( err );
					}
					res.json( comment );
				} );
			} );
		}
	);
} );

router.post( '/register', function ( req, res, next ) {
	if ( !req.body.username || !req.body.password ) {
		return res.status( 400 ).json( {message: "Please fill out all fields"});
	}
	
	passport.authenticate( 'local-signup', function ( err, user, info ) {
		if ( err ) {
			next( err );
		}
		if ( !user ) {
			return res.status( 400 ).json( {message: "Username already exists"});
		}

		return res.json( {token: user.generateJWT()} );
	} )( req, res, next );

} );


router.post( '/login', function ( req, res, next ) {
	if ( !req.body.username || !req.body.password ) {
		return res.status( 400 ).json( {message: "Please fill out all fields"} );
	}

	passport.authenticate( 'local', function ( err, user, info ) {
		if ( err ) {
			next( err );
		}

		if ( user ) {
			return res.json( {token: user.generateJWT()} );
		} else {
			return res.status( 401 ).json( info );
		}
	} )( req, res, next );
});

module.exports = router;