const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    postID: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    upRating: {
        type: Number,
        required: false,
        default: 0
    },
    downRating: {
        type: Number,
        required: false,
        default: 0
    },
    replyID: {
        type: Number,
        required: false
    },
    upvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    downvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    isFlagged: {
        type: Boolean,
        default: false
    }
});

// Static method that calculates and returns the comments count for a given post ID
CommentSchema.statics.getCommentsCountForPost = async function (postId) {
    const commentsCount = await this.countDocuments({ postID: postId });
    return commentsCount;
};

module.exports = mongoose.model("Comment", CommentSchema);
