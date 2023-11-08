const express = require('express');
const CategorySchema = require('../models/categories');
const router = express.Router();

//Create a category
router.post('/category', async (req, res) => {
    const category = new CategorySchema({ ...req.body })
    await category.save()
        .then(response => res.json(response))
        .catch(error => res.status(500).json(error))
})

// Read all categories
router.get('/categories', async (req, res) => {
    try {
        const category = await CategorySchema.find();
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single category
router.get('/category/:id', async (req, res) => {
    try {
        const category = await CategorySchema.findById(req.params.id);
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
