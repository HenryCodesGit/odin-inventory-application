const express = require('express');
const router = express.Router();

// Importing each model's controller
const ownerController = require('../controllers/ownerController');
const listingController = require('../controllers/listingController')
const categoryController = require('../controllers/categoryController')

// Setting the default route
router.get('/', listingController.index); //Default view will be set by the listingController

// Routes for all CRUD operations
// Listings
router.get('/listing/create', listingController.create_get);
router.post('/listing/create', listingController.create_post);

router.get('/listings', listingController.readAll_get)
router.get('/listing/:id/', listingController.readOne_get)

router.get('/listing/:id/update', listingController.update_get);
router.post('/listing/:id/update', listingController.update_post);

router.get('/listing/:id/delete', listingController.delete_get);
router.post('/listing/:id/delete', listingController.delete_post);

// Owners
router.get('/owner/create', ownerController.create_get);
router.post('/owner/create', ownerController.create_post);

router.get('/owners', ownerController.readAll_get)
router.get('/owner/:id/', ownerController.readOne_get)

router.get('/owner/:id/update', ownerController.update_get);
router.post('/owner/:id/update', ownerController.update_post);

router.get('/owner/:id/delete', ownerController.delete_get);
router.post('/owner/:id/delete', ownerController.delete_post);

// Categories
router.get('/category/create', categoryController.create_get);
router.post('/category/create', categoryController.create_post);

router.get('/categories', categoryController.readAll_get)
router.get('/category/:id/', categoryController.readOne_get)

router.get('/category/:id/update', categoryController.update_get);
router.post('/category/:id/update', categoryController.update_post);

router.get('/category/:id/delete', categoryController.delete_get);
router.post('/category/:id/delete', categoryController.delete_post);

module.exports = router;