const express = require('express')
const router = require("express").Router();
const { User, validate, calculateReliabilityScore } = require('../models/users');

const bcrypt = require("bcrypt");

// Register a User
router.post('/registerUser/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res
                .status(409)
                .send({ message: "User with given email already Exist!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" + error });
    }
});

//Get all
router.get('/getUsers/', async (req, res) => {
    const findUser = await User.find()
    // old
    // const findUser = await UserSchema.find()
    res.json(findUser)
})

// Get a single user by _id
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // Recalculate the "Reliability Score" and update it in the User model
        const reliabilityScore = await calculateReliabilityScore(req.params.id);
        user.reliabilityScore = reliabilityScore;

        user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single user by email
router.get('/userEmail/:email', async (req, res) => {
    try {
        var query = { email: req.params.email };
        const user = await User.findOne(query);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'user deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/user/:id', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            // Check if the error is specifically about the "password" field
            if (error.details[0].path[0] === 'password') {
                // If it's about the password field, remove that error and continue
                error.details = error.details.filter((detail) => detail.path[0] !== 'password');
            } else {
                // If it's about a different field, return the error
                return res.status(400).send({ message: error.details[0].message });
            }
        }

        // Update the user data
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
