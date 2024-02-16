const Listing = require('../models/listing');
const Category = require('../models/category');
const Owner = require('../models/owner');

const asyncHandler = require('express-async-handler');

const { body, validationResult } = require('express-validator');

// Helper functions
async function getCategoryOwners(){
     return await Promise.all([
        Category.find({}).sort({name: 1}).exec(),
        Owner.find({}).sort({name: 1}).exec(),
    ])
}

// Default path for the app
exports.index = asyncHandler(async (req, res, next) => {
    const [
        numCategories,
        numListings,
        numOwners
    ] = await Promise.all([
        Category.countDocuments({}).exec(),
        Listing.countDocuments({}).exec(),
        Owner.countDocuments({}).exec(),
    ])

    res.render('index',{
        title: 'Index',
        numCategories,
        numListings,
        numOwners,
    })
})

// Create
exports.create_get = asyncHandler(async (req, res, next) => {
    //TODO: Instead get the owner that is currently logged in instead of passing all owners and allow selection
    const [categories, owners] = await getCategoryOwners();

    res.render('listing_form',{
        title: 'Create new listing',
        categories,
        owners
    })
})
exports.create_post = [
    //Sanitize and validate
    body('name','Title of listing is required and must be at least minimum 3 characters')
        .trim()
        .isLength({min: 3})
        .escape(),
    body('price', 'Value is required and must be a number greater than or equal to 0')
        .trim()
        .escape()
        .custom((value, {req, location, path}) => {
            const {body: {price}} = req;
            const priceFloat = parseFloat(price).toFixed(2);
            return priceFloat >= 0}),
    body('owner', 'Owner must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('category', 'Category must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('details')
        .trim()
        .escape(),
    
    //Process request
    asyncHandler(async (req, res, next) => {
        const details = {
            name: req.body.name,
            price: req.body.price,
            date_posted: Date.now(),
            owner: req.body.owner,
            category: req.body.category,
            details: req.body.description,
        };

        const errors = validationResult(req);

        //Additional Validation from the SchemaType. Note: This shouldn't happen if validation happened correctly above?
        let listing;
        if(errors.isEmpty())
            listing = await Listing.create(details)
                .catch(err => errors.errors.push({msg: err.message}));

        //Validation from the 'Express-validation' module
        if(!errors.isEmpty()){
            const [categories, owners] = await getCategoryOwners();
            
            //Redo the form
            res.render('listing_form',{
                errors: errors.array(), //Pass the error back so it can be used to note any back-end validation errors
                title: 'Create new listing',
                categories,
                owners,
                listing: details, //Pass the listing back so it can be used to refill the form
            })
        } else {
            listing.save();
            res.redirect(listing.url);
        }
    })
]

// Read
exports.readOne_get = asyncHandler(async (req, res, next) => {
    const listing = await Listing
        .findById(req.params.id)
        .populate('category owner')
        .exec();

    res.render('listing_readOne', {
        title: 'Listing Details',
        listing
    })
})
exports.readAll_get = asyncHandler(async (req, res, next) => {
    const listings = await Listing
        .find({})
        .populate('category owner')
        .sort({date_posted: 1})
        .exec();

    res.render('listing_readAll', {
        title: 'All Listings',
        listings
    })
})

// Update
exports.update_get = asyncHandler(async (req, res, next) => {
    // Get all the details from the database
    const [[categories, owners], listing] = await Promise.all([
        await getCategoryOwners(),
        Listing.findById(req.params.id).exec()
    ])
            
    //Repopulate the form
    res.render('listing_form',{
        title: 'Update listing',
        categories,
        owners,
        listing, //Pass the listing back so it can be used to refill the form. //TODO: Only price, description, and title should be editable
    })
})
exports.update_post = [
    //Sanitize and validate
    body('name','Title of listing is required and must be at least minimum 3 characters')
        .trim()
        .isLength({min: 3})
        .escape(),
    body('price', 'Value is required and must be a number greater than or equal to 0')
        .trim()
        .escape()
        .custom((value, {req, location, path}) => {
            const {body: {price}} = req;
            const priceFloat = parseFloat(price).toFixed(2);
            return priceFloat >= 0}),
    body('owner', 'Owner must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('category', 'Category must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('details')
        .trim()
        .escape(),
    
    //Process request
    asyncHandler(async (req, res, next) => {

        //Finds the current listing
        const currentListing = await Listing.findById(req.params.id);

        const details = {
            name: req.body.name,
            price: req.body.price,
            date_posted: currentListing.date_posted, //Note: This stays unchangeed from original
            owner: req.body.owner, //TODO: This should not be updatable when editting a form
            category: req.body.category,  //TODO: This should not be updatable when editting a form
            details: req.body.description,
        };

        const errors = validationResult(req);

        //Additional Validation from the SchemaType. Note: This shouldn't happen if validation happened correctly above?
        let listing;
        if(errors.isEmpty())
            listing = new Listing(details)
            await Listing.validate(details).catch(err => errors.errors.push({msg: err.message}));

        //Validation from the 'Express-validation' module
        if(!errors.isEmpty()){
            const [categories, owners] = await getCategoryOwners();
            
            //Redo the form
            res.render('listing_form',{
                errors: errors.array(), //Pass the error back so it can be used to note any back-end validation errors
                title: 'Create new listing',
                categories,
                owners,
                listing: details, //Pass the listing back so it can be used to refill the form
            })
        } else {
            await Listing.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                price: req.body.price,
                details: req.body.description
            }).exec();
            res.redirect(currentListing.url);
        }
    })
]

// Delete
exports.delete_get = asyncHandler(async (req, res, next) => {0
    const listing = await Listing
        .findById(req.params.id)
        .populate('category owner')
        .exec();

    res.render('listing_delete', {
        title: 'Listing Delete',
        listing
    })
    
})
exports.delete_post = asyncHandler(async (req, res, next) => {
    console.log(req.params.id);
    await Listing.findByIdAndDelete(req.params.id).exec();
    res.redirect('/browse/listings/');
})