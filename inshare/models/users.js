const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: false,
        default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=='
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    upvotedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default: []
        }
    ],
    downvotedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default: []
        }
    ],
    upvotedComments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: []
        }
    ],
    downvotedComments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: []
        }
    ],
    reliabilityScore: {
        type: Number,
        required: false,
        default: 0, // Initial value
    },
    upvotesReceived: {
        type: Number,
        required: false,
        default: 0
    },
    downvotesReceived: {
        type: Number,
        required: false,
        default: 0
    },
});

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

const User = mongoose.model('User', UserSchema);

const validate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label("First Name"),
        surname: Joi.string().required().label("Last Name"),
        username: Joi.string().required().label("Username"),
        profileImage: Joi.string().required().label("Profile Image Url"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        isAdmin: Joi.boolean().required().label("Is Admin"),
    });
    return schema.validate(data);
};

const calculateReliabilityScore = async (userId) => {

    // Get the user's upvoted and downvoted posts and comments
    const user = await User.findById(userId);
    if (!user) {
        return 0; // User not found
    }

    // Calculate the user's upvote and downvote counts
    const upvoteCount = user.upvotesReceived;
    const downvoteCount = user.downvotesReceived;

    // Define the weight for upvotes and downvotes (you can adjust these values)
    const upvoteWeight = 1.2;
    const downvoteWeight = -1.1;

    // Calculate the "Reliability Score"
    const reliabilityScore = upvoteWeight * upvoteCount + downvoteWeight * downvoteCount;

    return reliabilityScore;
};

module.exports = { User, validate, calculateReliabilityScore };
