const router = require('express').Router();
const { validationResult, body } = require('express-validator/check');
const isValid = require('mongoose').mongo.ObjectId.isValid;
const User = require('../../models/User');
const Post = require('../../models/Post');
const auth = require('../../middleware/auth');
const {postValidator, errorFormatter} = require('../../validators/post');

// @route  GET api/posts
// @desc   Get all posts
// @access Private
router.get('/', async (req, res, next) => {
	try{ 

		const posts = await Post.find().sort({date: -1});

		res.json(posts);

	}catch(err){
		console.error(err);
		res.sendStatus(500);
	}
});

// @route  GET api/posts/:post_id
// @desc   Get one post
// @access Private
router.get('/:post_id', async (req, res, next) => {
	try{ 
		const { post_id: _id } = req.params;

		if(!isValid(_id)) return res.json({errors: [{msg: 'Given post doesnt\'t exist.'}]});

		const post = await Post.findOne({_id}).sort({date: -1});

		if(!post) return res.json({msg: 'Post doesn\'t exist.'});

		res.json(post);

	}catch(err){
		console.error(err);
		res.sendStatus(500);
	}
});

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post('/', auth, postValidator, async (req, res, next) => {
	const result = validationResult(req).formatWith(errorFormatter);
	if(!result.isEmpty()){
		return res.status(422).json({errors: result.array()});
	}
	try{ 
		const user = await User.findById(req.user._id).select('-password');

		//Populate other fields with found user
		const { name, avatar, _id: userId } = user;
		const { text } = req.body;

		const newPost = new Post({
			userId,
			text,
			name,
			avatar
		});

		const post = await newPost.save();

		res.json(post);

	}catch(err){
		console.error(err);
		res.sendStatus(500);
	}

});

// @route  DELETE api/posts/:post_id
// @desc   Deletes users post
// @access Private
router.delete('/:post_id', auth, async (req, res, next) => {
	try{
		const { post_id: _id } = req.params;

		if(!isValid(_id)) return res.json({msg: 'Given post doesnt\'t exist.'});

		const post = await Post.findById(_id);

		if(!post) return res.json({msg: 'Post doesn\'t exist.'})

		if(post.userId.toString() === req.user._id.toString()){
			const result = await post.remove();
			
			return res.json({msg: 'Post removed', removedPost: result});
		}

		//If post is not from valid user

		res.status(403).json({msg: 'You can\'t delete other people\'s posts'});
/*
		const result = await Post.deleteOne({
			_id: _id,
			userId: req.user._id.toString()
		});

		if(result.deletedCount === 1) {
			console.log('Deleted');
		}else{
			console.log('0 deleted');
		}
*/
	}catch(err){
		console.error(err);
		res.sendStatus(500);
	}

});


// @route  PUT api/posts/:post_id/like
// @desc   Like a post
// @access Private
router.put('/:post_id/like', auth, async (req, res, next) => {
	const { post_id } = req.params;
	try{
		
		if(!isValid(post_id)) return res.json({msg: 'Given post doesnt\'t exist.'});


		const post = await Post.findById(post_id);


		if(!post) return res.json({msg: 'Given post doesnt\'t exist.'});

		if( post.likes.find( like => like.userId.toString() === req.user.id.toString() ) ){
			return res.status(400).json({msg: 'Post is already liked.'});
		}

		post.like(req);

		await post.save();

		res.json(post.likes);

	}catch(err){
		console.error(err);
		res.sendStatus(500);
	}
});

// @route  PUT api/posts/:post_id/unlike
// @desc   Remove a like from a post
// @access Private

router.put('/:post_id/unlike', auth, async (req, res, next) => {
	const { post_id } = req.params;
	try{
		
		const post = await Post.findById(post_id);
		
		if(!post) return res.json({msg: 'Post does\'t exist.'});
	

		if(
			post.likes.filter(like => like.userId.toString() === req.user.id.toString()).length === 0
		){
			
			return res.status(400).json({msg: 'Post has not yet been liked.'});
		}

		const removeIndex = post.likes.map(like => like.userId.toString()).indexOf(req.user._id.toString());

		/* Or like this:
			await Post.updateOne({
				_id: post_id
			}, {
				likes: {$pull: {userId: userId}}
			});
		*/

		post.unlike(req, removeIndex);

		await post.save();

		res.json(post.likes);

	}catch(err){
		console.error(err);
		res.sendStatus(500);
	}
});

// @route  PUT api/posts/:post_id/comment
// @desc   Add a comment to post
// @access Private
router.put('/:post_id/comment', auth, [ body('text', 'Comment must not be empty.').not().isEmpty() ], async (req, res, next) => {
	const {post_id} = req.params;
	const {text} = req.body;
	const {name, _id: userId, avatar} = req.user;
	try{
		const post = await Post.findById(post_id);
		
		const newComment = {
			text,
			name,
			userId,
			avatar
		};

		post.comments.unshift(newComment);

		await post.save();

		res.json(post.comments);


	}catch(err){
		console.error(err);
		res.sendStatus(500);
	}
});


// @route  DELETE api/posts/:post_id/comment
// @desc   Delete comment from a post
// @access Private
router.delete('/:post_id/comment/:comment_id', auth, async (req, res, next) => {
	const {post_id, comment_id} = req.params;
	try{
		//Check if given post_id and comment_id is of valid format
		if(!isValid(post_id) || !isValid(comment_id)) return res.json({msg: 'Comment or post doesn\'t exist.'});
		const {comments: [comment]} = await Post.findOne({_id: post_id, comments: {$elemMatch: {_id: comment_id}}}, {
			_id: 0,
			"comments.$": 1
		}) || {comments: [null]}; 
		//Check if comment exists
		if(!comment) return res.json({msg: 'Comment doesn\'t exist.'});
		//Check if the comment is from the logged in user
		if(comment.userId.toString() !== req.user._id.toString()) return res.json({msg: 'User not authorized to delete this comment.'});
		//Delete comment from posts
		const {comments} = await Post.findOneAndUpdate(
		{
			_id: post_id,
			comments: {$elemMatch: {_id: comment_id}}
		}, 
		{
			$pull: {comments: {_id: comment_id}}
		},
		{
			projection: {
				"_id": 0,
				"comments": 1,
			},
			new: true //Don't give me deleted comments
		});

		res.json({msg: 'Comment deleted.', comments, deletedComment: comment});

	}catch(err){
		console.error(err);
		res.sendStatus(500);
	}
}); 


module.exports = router;

