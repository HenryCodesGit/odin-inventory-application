const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        minLength: [3, 'Minimum length of 3 is required for the listing title'], 
    },
    price: { 
        type: Number,
        required: true,
        min: 0
    },
    date_posted: {
        type: Date,
        required: true,
        default: Date.now,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    details: { 
        type: String, 
    },
});

// Virtual for author's URL
ListingSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/browse/listing/${this._id}`;
});

//Virtual for age of listing
ListingSchema.virtual('age').get(function() {
    return 'NOT YET IMPLEMENTED: Listing.age'; //TODO
})

// Export model
module.exports = mongoose.model('Listing', ListingSchema);