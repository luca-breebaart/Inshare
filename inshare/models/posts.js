const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    heading: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: ''
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
    date: {
        type: Date,
        required: true
    },    
    userID: {
        type: String,
        required: true
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
        required: false,
        default: false
    }
});

// In your PostSchema definition
PostSchema.index({ content: 'text', heading: 'text' });

module.exports = mongoose.model("Post", PostSchema);
