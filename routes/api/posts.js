const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('./../../middleware/auth');

const User = require('./../../models/User');
const Profile = require('./../../models/Profile');
const Post = require('./../../models/Post');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, [
    check('text', 'Texto é obrigatório').not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const userProfile = await Profile.findOne({user: req.user.id}).populate('user', ['name']);
        const newPost = new Post({
            text: req.body.text,
            name: userProfile.name,
            user: req.user.id
        });
        const post = await newPost.save();

        //post creator avatar
        const profile = await Profile.findOne({user: post.user}).select('avatar');
        post.avatar = profile.avatar;

        res.json(post);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let posts = await Post.find().sort({date: -1});

        for(i = 0; i < posts.length; i++){
            const profile = await Profile.findOne({user: posts[i].user}).select('avatar');
            posts[i].avatar = profile.avatar
        }

        res.json(posts);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:postId
// @desc    Get post by id
// @access  Private
router.get('/:postId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }

        //post creator avatar
        const profile = await Profile.findOne({user: post.user}).select('avatar');
        post.avatar = profile.avatar;

        //post comments avatar
        for(i = 0; i < post.comments.length; i++){
            const p = await Profile.findOne({user: post.comments[i].user}).select('avatar');
            post.comments[i].avatar = p.avatar;
        }
        
        res.json(post);
        
    } catch (error) {
        console.error(error.message);

        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'});
        }

        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/:postId
// @desc    Delete a post by id
// @access  Private
router.delete('/:postId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }

        //Check user
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        }

        await post.remove();

        res.json({msg: 'Post removed'});
        
    } catch (error) {
        console.error(error.message);

        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'});
        }

        res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/like/:postId
// @desc    Like a post
// @access  Private
router.put('/like/:postId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }

        //check if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: 'Post already liked'});
        }

        post.likes.unshift({user: req.user.id});
        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error.message);

        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'});
        }

        res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/unlike/:postId
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:postId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }

        const likesBefore = post.likes.length;
        //filter like off
        post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
        if(likesBefore === post.likes.length){
            return res.status(400).json({msg: 'Post has not yet been liked'});
        }

        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error.message);

        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'});
        }

        res.status(500).send('Server Error');
    }
});

// @route   POST api/posts/comment/:postId
// @desc    Comment on a post
// @access  Private
router.post('/comment/:postId', [auth, [
    check('text', 'Text is required').not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const userProfile = await Profile.findOne({user: req.user.id}).populate('user', ['name']);

        const post = await Post.findById(req.params.postId);
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }
      
        const newComment = {
            text: req.body.text,
            name: userProfile.name,
            user: req.user.id
        };

        post.comments.unshift(newComment);
        await post.save();
        
         //post comments avatar
         for(i = 0; i < post.comments.length; i++){
            const p = await Profile.findOne({user: post.comments[i].user}).select('avatar');
            post.comments[i].avatar = p.avatar;
        }

        res.json(post.comments);

    } catch (error) {
        console.error(error.message);

        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'});
        }

        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/comment/:postId/:commentId
// @desc    Delete a comment from a post
// @access  Private
router.delete('/comment/:postId/:commentId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }

        //Pull out comment
        const comment = post.comments.find(comment => comment.id.toString() === req.params.commentId);
        if(!comment){
            return res.status(404).json({msg: 'Comment not found'});
        }

        //Check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        }

        //Remove comment
        post.comments = post.comments.filter(comment => comment.id.toString() !== req.params.commentId);
        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.error(error.message);

        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post or comment not found'});
        }

        res.status(500).send('Server Error');
    }
});

module.exports = router;