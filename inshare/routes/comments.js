const express = require('express');
const CommentSchema = require('../models/comments');
const { User, validate, calculateReliabilityScore } = require('../models/users');
const authMiddleware = require('./authMiddleware'); // Import the authentication middleware
const router = express.Router();

//Create a comment
router.post('/comment', async (req, res) => {
    const comment = new CommentSchema({ ...req.body })
    await comment.save()
        .then(response => res.json(response))
        .catch(error => res.status(500).json(error))
})

// Read all comments
router.get('/comments/all', async (req, res) => {
    try {
        const comment = await CommentSchema.find();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single comment
router.get('/comment/:id', async (req, res) => {
    try {
        const comment = await CommentSchema.findById(req.params.id);
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a comment
router.put('/comment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await CommentSchema.findByIdAndUpdate(id, req.body);
        res.json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a comment
router.delete('/comment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await CommentSchema.findByIdAndDelete(id);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get comments count for a post
router.get('/comments/count/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const commentsCount = await CommentSchema.getCommentsCountForPost(postId);
        res.json({ commentsCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get comments by postID
router.get('/comments/:postID', async (req, res) => {
    try {
        const { postID } = req.params;

        // Use the Comment model to find comments with the specified postID
        const comments = await CommentSchema.find({ postID: postID });

        if (!comments) {
            return res.status(404).json({ error: 'No comments found for the specified postID' });
        }

        // Return the comments as a JSON response
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upvote a comment
router.post('/comment/upvote/:id', authMiddleware, async (req, res) => {

    // Check for the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        // Handle the case where 'Authorization' header is missing, for example, by sending a 401 Unauthorized response
        return res.status(401).json({ message: 'Authorization header is missing' });
    }
    // The Authorization header should be in the format "Bearer <token>"
    // If 'Authorization' header is present, split it to get the token
    const tokenA = authHeader.split(' ')[1];
    console.log('router.post(/comment/upvote/:id,authMiddleware:', tokenA);
    console.log('req.params: ', req.params);
    console.log('req.user: ', req.user);

    const commentId = req.params.id;
    console.log(commentId)
    const userId = req.user._id; // Assuming user data is available in req.user

    const comment = await CommentSchema.findById(commentId);
    console.log(comment);
    if (!comment) {
        return res.status(404).json({ error: 'comment not found' });
    }

    const commentCreatorId = comment.userID;
    const commentCreator = await User.findById(commentCreatorId);

    // Update the user's upvotedComments array
    const user = await User.findById(userId);
    if (!user) {
        // Handle the case where the user is not found
        return res.status(404).send('User not found');
    }
    if (!user.upvotedComments) {
        user.upvotedComments = [];
    }

    // Check if the user has already upvoted this comment
    if (comment.upvotes.includes(userId)) {

        // User has already upvoted; remove the upvote
        comment.upvotes.pull(userId);
        comment.upRating--;

        if (user.upvotedComments.includes(commentId)) {
            user.upvotedComments.pull(commentId);
            // Update the post's creator's upvotesReceived count
            if (commentCreator) {
                commentCreator.upvotesReceived--;
                await commentCreator.save(); // Save the updated user
            }
        }
    } else {
        // User hasn't upvoted; add the upvote
        comment.upvotes.push(userId); // ? This is working
        comment.upRating++; // Increment upvote count on the comment // ? This is working

        if (!user.upvotedComments.includes(commentId)) {
            user.upvotedComments.push(commentId);
            // Update the post's creator's upvotesReceived count
            if (commentCreator) {
                commentCreator.upvotesReceived++;
                await commentCreator.save(); // Save the updated user
            }
        }

        // Check if the user had previously downvoted this comment and remove the downvote
        if (comment.downvotes.includes(userId)) {
            comment.downvotes.pull(userId);
            comment.downRating--;
        }
        if (user.downvotedComments.includes(commentId)) {
            user.downvotedComments.pull(commentId);
            // Update the post's creator's downvotesReceived count
            if (commentCreator) {
                commentCreator.downvotesReceived--;
                await commentCreator.save(); // Save the updated user
            }
        }
    }

    await comment.save();
    // Save the updated user
    await user.save();

    // Recalculate the "Reliability Score" and update it in the User model
    // const reliabilityScore = await calculateReliabilityScore(userId);
    // user.reliabilityScore = reliabilityScore;

    // Respond with success or any other necessary action
    res.status(200).send('Reliability score updated | Vote updated successfully');
    console.log('Vote updated successfully')
});


// Downvote a comment (similar logic as upvoting)
router.post('/comment/downvote/:id', authMiddleware, async (req, res) => {

    // Check for the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        // Handle the case where 'Authorization' header is missing, for example, by sending a 401 Unauthorized response
        return res.status(401).json({ message: 'Authorization header is missing' });
    }
    // The Authorization header should be in the format "Bearer <token>"
    // If 'Authorization' header is present, split it to get the token
    const tokenA = authHeader.split(' ')[1];
    console.log('router.post(/comment/downvote/:id,authMiddleware:', tokenA);
    console.log('req.params: ', req.params);
    console.log('req.user: ', req.user);

    const commentId = req.params.id;
    const userId = req.user._id; // Assuming user data is available in req.user

    const comment = await CommentSchema.findById(commentId);
    if (!comment) {
        return res.status(404).json({ error: 'comment not found' });
    }

    const commentCreatorId = comment.userID;
    const commentCreator = await User.findById(commentCreatorId);

    // Update the user's downvotedPosts array
    const user = await User.findById(userId);
    if (!user) {
        // Handle the case where the user is not found
        return res.status(404).send('User not found');
    }
    if (!user.downvotedComments) {
        user.downvotedComments = [];
    }

    // Check if the user has already downvoted this comment
    if (comment.downvotes.includes(userId)) {

        // User has already downvoted; remove the downvote
        comment.downvotes.pull(userId);
        comment.downRating--;

        if (user.downvotedComments.includes(commentId)) {
            user.downvotedComments.pull(commentId);
            // Update the post's creator's downvotesReceived count
            if (commentCreator) {
                commentCreator.downvotesReceived--;
                await commentCreator.save(); // Save the updated user
            }
        }
    } else {
        // User hasn't downvoted; add the downvote

        comment.downvotes.push(userId); // ? This is working
        comment.downRating++;

        if (!user.downvotedComments.includes(commentId)) {
            user.downvotedComments.push(commentId);
            // Update the post's creator's upvotesReceived count
            if (commentCreator) {
                commentCreator.downvotesReceived++;
                await commentCreator.save(); // Save the updated user
            }
        }

        // Check if the user had previously upvoted this comment and remove the upvote also dec upvotes
        if (comment.upvotes.includes(userId)) {
            comment.upvotes.pull(userId);
            comment.upRating--;
        }
        if (user.upvotedComments.includes(commentId)) {
            user.upvotedComments.pull(commentId);
            // Update the post's creator's upvotesReceived count
            if (commentCreator) {
                commentCreator.upvotesReceived--;
                await commentCreator.save(); // Save the updated user
            }
        }
    }

    await comment.save();
    // Save the updated user
    await user.save();

    // Recalculate the "Reliability Score" and update it in the User model
    // const reliabilityScore = await calculateReliabilityScore(userId);
    // user.reliabilityScore = reliabilityScore;

    // Respond with success or any other necessary action
    res.status(200).send('Reliability score updated | Vote updated successfully');
    console.log('Vote updated successfully')
});

// Add a new route to flag a post
router.put('/comment/flag/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await CommentSchema.findByIdAndUpdate(id, { isFlagged: true }, { new: true });
        if (!comment) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch comments by user ID
router.get('/comments/user/:userID', async (req, res) => {
    try {
        const { userID } = req.params;

        // Use the Comment model to find comments with the specified userID
        const comments = await CommentSchema.find({ userID: userID });

        if (!comments || comments.length === 0) {
            return res.status(404).json({ error: 'No comments found for the specified user' });
        }

        // Return the comments as a JSON response
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
