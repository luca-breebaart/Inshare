const express = require('express');
const PostSchema = require('../models/posts');
const { User, validate, calculateReliabilityScore } = require('../models/users');
// const User = require('../models/users');
// const calculateReliabilityScore = require("../models/users");
const authMiddleware = require('./authMiddleware'); // Import the authentication middleware
const router = express.Router();

//Create a post
router.post('/post', async (req, res) => {
    const post = new PostSchema({ ...req.body })
    await post.save()
        .then(response => res.json(response))
        .catch(error => res.status(500).json(error))
})

// Read all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await PostSchema.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single post
router.get('/post/:id', async (req, res) => {
    try {
        const post = await PostSchema.findById(req.params.id);
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a post
router.put('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await PostSchema.findByIdAndUpdate(id, req.body);
        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a post
router.delete('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await PostSchema.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search posts
router.get('/posts/search', async (req, res) => {
    try {

        const { query } = req.query;
        console.log("Received search query:", query); // Log the received query

        // Perform a case-insensitive search on the 'content' and 'heading' fields
        const posts = await PostSchema.find({
            $or: [
                { content: { $regex: new RegExp(query, 'i') } },
                { heading: { $regex: new RegExp(query, 'i') } }
            ]
        });

        console.log("Matching posts:", posts); // Log the posts found

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upvote a post
router.post('/post/upvote/:id', authMiddleware, async (req, res) => {

    // Check for the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        // Handle the case where 'Authorization' header is missing, for example, by sending a 401 Unauthorized response
        return res.status(401).json({ message: 'Authorization header is missing' });
    }
    // The Authorization header should be in the format "Bearer <token>"
    // If 'Authorization' header is present, split it to get the token
    const tokenA = authHeader.split(' ')[1];
    console.log('router.post(/post/upvote/:id,authMiddleware:', tokenA);
    console.log('req.params: ', req.params);
    console.log('req.user: ', req.user);

    const postId = req.params.id;
    const userId = req.user._id; // Assuming you have user data in req.user after authentication

    const post = await PostSchema.findById(postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const postCreatorId = post.userID;
    const postCreator = await User.findById(postCreatorId);

    // Update the user's upvotedPosts array
    const user = await User.findById(userId);
    if (!user) {
        // Handle the case where the user is not found
        return res.status(404).send('User not found');
    }
    if (!user.upvotedPosts) {
        user.upvotedPosts = [];
    }

    // Check if the user has already upvoted this post
    if (post.upvotes.includes(userId)) {

        // User has already upvoted; remove the upvote
        post.upvotes.pull(userId);
        post.upRating--;

        if (user.upvotedPosts.includes(postId)) {
            user.upvotedPosts.pull(postId);
            // Update the post's creator's upvotesReceived count
            if (postCreator) {
                postCreator.upvotesReceived--;
                await postCreator.save(); // Save the updated user
            }
        }
    } else {
        // User hasn't upvoted; add the upvote

        post.upvotes.push(userId); // ? This is working
        post.upRating++; // Increment upvote count on the comment // ? This is working

        if (!user.upvotedPosts.includes(postId)) {
            user.upvotedPosts.push(postId);
            // Update the post's creator's upvotesReceived count
            if (postCreator) {
                postCreator.upvotesReceived++;
                await postCreator.save(); // Save the updated user
            }
        }

        // Check if the user had previously downvoted this post and remove the downvote
        if (post.downvotes.includes(userId)) {
            post.downvotes.pull(userId);
            post.downRating--;
        }
        if (user.downvotedPosts.includes(postId)) {
            user.downvotedPosts.pull(postId);
            // Update the post's creator's downvotesReceived count
            if (postCreator) {
                postCreator.downvotesReceived--;
                await postCreator.save(); // Save the updated user
            }
        }
    }

    await post.save();
    // Save the updated user
    await user.save();

    // Recalculate the "Reliability Score" and update it in the User model
    // const reliabilityScore = await calculateReliabilityScore(userId);
    // User.reliabilityScore = reliabilityScore;

    // Respond with success or any other necessary action
    res.status(200).send('Reliability score updated | Vote updated successfully');
    // res.json({ message: 'Vote updated successfully' });
    console.log('Vote updated successfully')
});

// Downvote a post (similar logic as upvoting)
router.post('/post/downvote/:id', authMiddleware, async (req, res) => {

    // Check for the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        // Handle the case where 'Authorization' header is missing, for example, by sending a 401 Unauthorized response
        return res.status(401).json({ message: 'Authorization header is missing' });
    }
    // The Authorization header should be in the format "Bearer <token>"
    // If 'Authorization' header is present, split it to get the token
    const tokenA = authHeader.split(' ')[1];
    console.log('router.post(/post/downvote/:id,authMiddleware:', tokenA);
    console.log('req.params: ', req.params);
    console.log('req.user: ', req.user);

    const postId = req.params.id;
    const userId = req.user._id; // Assuming you have user data in req.user after authentication

    const post = await PostSchema.findById(postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const postCreatorId = post.userID;
    const postCreator = await User.findById(postCreatorId);

    // Update the user's downvotedPosts array
    const user = await User.findById(userId);
    if (!user) {
        // Handle the case where the user is not found
        return res.status(404).send('User not found');
    }
    if (!user.downvotedPosts) {
        user.downvotedPosts = [];
    }

    // Check if the user has already downvoted this post
    if (post.downvotes.includes(userId)) {

        // User has already downvoted; remove the downvote
        post.downvotes.pull(userId);
        post.downRating--;

        if (user.downvotedPosts.includes(postId)) {
            user.downvotedPosts.pull(postId);
            // Update the post's creator's downvotesReceived count
            if (postCreator) {
                postCreator.downvotesReceived--;
                await postCreator.save(); // Save the updated user
            }
        }
    } else {
        // User hasn't downvoted; add the downvote

        post.downvotes.push(userId); // ? This is working
        post.downRating++;

        if (!user.downvotedPosts.includes(postId)) {
            user.downvotedPosts.push(postId);
            // Update the post's creator's upvotesReceived count
            if (postCreator) {
                postCreator.downvotesReceived++;
                await postCreator.save(); // Save the updated user
            }
        }

        // Check if the user had previously upvoted this post and remove the upvote also dec upvotes
        if (post.upvotes.includes(userId)) {
            post.upvotes.pull(userId);
            post.upRating--;
        }
        if (user.upvotedPosts.includes(postId)) {
            user.upvotedPosts.pull(postId);
            // Update the post's creator's upvotesReceived count
            if (postCreator) {
                postCreator.upvotesReceived--;
                await postCreator.save(); // Save the updated user
            }
        }
    }

    await post.save();
    // Save the updated user
    await user.save();

    // User.downvotedPosts = User.downvotedPosts.filter(postId => postId.toString() !== postId);

    // Recalculate the "Reliability Score" and update it in the User model
    // const reliabilityScore = await calculateReliabilityScore(userId);
    // User.reliabilityScore = reliabilityScore;

    // Respond with success or any other necessary action
    res.status(200).send('Reliability score updated | Vote updated successfully');
    console.log('Vote updated successfully')
});

// Add a new route to flag a post
router.put('/post/flag/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostSchema.findByIdAndUpdate(id, { isFlagged: true }, { new: true });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new route to fetch posts by user ID
router.get('/posts/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await PostSchema.find({ userID: userId });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;
