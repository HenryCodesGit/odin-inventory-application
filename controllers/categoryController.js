const Category = require('../models/category');
const Listing = require('../models/listing');
const asyncHandler = require('express-async-handler');

// Create
exports.create_get = asyncHandler(async (req, res, next) => {
    res.send('Not implemented: GET - Create category')
})
exports.create_post = asyncHandler(async (req, res, next) => {
    res.send('Not implemented: POST - Create Category')
})

// Read
exports.readOne_get = asyncHandler(async (req, res, next) => {
    const [category, listingsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Listing.find({category: req.params.id}).sort({date_posted: 1}).exec(),
    ])

    res.render('category_readOne', {
        title: 'Category Listings',
        category,
        listingsInCategory,
    })
})
exports.readAll_get = asyncHandler(async (req, res, next) => {
    const categories = await Category
        .find({})
        .sort({name: 1})
        .exec();

    res.render('category_readAll', {
        title: 'All Categories',
        categories
    })
})


// Update
exports.update_get = asyncHandler(async (req, res, next) => {
    res.send(`Not implemented: GET - Update one Category of Id: ${req.params.id} `)
})
exports.update_post = asyncHandler(async (req, res, next) => {
    res.send(`Not implemented: POST - Update one Category of Id: ${req.params.id} `)
})

// Delete
exports.delete_get = asyncHandler(async (req, res, next) => {
    res.send(`Not implemented: GET - Delete one Category of Id: ${req.params.id} `)
})
exports.delete_post = asyncHandler(async (req, res, next) => {
    res.send(`Not implemented: POST - Delete one Category of Id: ${req.params.id} `)
})