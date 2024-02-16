const Owner = require('../models/owner');
const Listing = require('../models/listing');

const asyncHandler = require('express-async-handler');

// Create
exports.create_get = asyncHandler(async (req, res, next) => {
    res.send('Not implemented: GET - Create Owner')
})
exports.create_post = asyncHandler(async (req, res, next) => {
    res.send('Not implemented: POST - Create Owner')
})

// Read
exports.readOne_get = asyncHandler(async (req, res, next) => {
    const [owner, listingsByOwner] = await Promise.all([
        Owner.findById(req.params.id).exec(),
        Listing.find({owner: req.params.id}).sort({date_posted: 1}).exec(),
    ])

    res.render('owner_readOne', {
        title: 'Listings by Owner',
        owner,
        listingsByOwner,
    })
})
exports.readAll_get = asyncHandler(async (req, res, next) => {
    const owners = await Owner
        .find({})
        .sort({NamedNodeMap: 1})
        .exec();

    res.render('owner_readAll', {
        title: 'All Users',
        owners
    })
})

// Update
exports.update_get = asyncHandler(async (req, res, next) => {
    res.send(`Not implemented: GET - Update one Owner of Id: ${req.params.id} `)
})
exports.update_post = asyncHandler(async (req, res, next) => {
    res.send(`Not implemented: POST - Update one Owner of Id: ${req.params.id} `)
})

// Delete
exports.delete_get = asyncHandler(async (req, res, next) => {
    res.send(`Not implemented: GET - Delete one Owner of Id: ${req.params.id} `)
})
exports.delete_post = asyncHandler(async (req, res, next) => {
    res.send(`Not implemented: POST - Delete one Owner of Id: ${req.params.id} `)
})