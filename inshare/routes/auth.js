const express = require('express');
// const router = require("express").Router();
const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'noSleep';

const router = express.Router();

router.post('/auth', async (req, res) => {
    try {

        // Check if email and password are provided in the request body
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'No Email or Password Entered' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        // Generate a JWT token with user data
        const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET_KEY);

        console.log('Generated Token:', token);

        // Set the token as a cookie (secure and httpOnly for security)
        res.cookie('token', token, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
        });

        res.status(200).json({ message: 'Logged in successfully', data: token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = router;