const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const OwnerSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        minLength: 3, 
        maxLength: 100 
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true,
        validate: [validator.isEmail, 'Please fill a valid email address']
    }
});

// Virtual for owner's URL
OwnerSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/browse/owner/${this._id}`;
});

//Virtual for age of listing
OwnerSchema.virtual('account_age').get(function() {
    return 'NOT YET IMPLEMENTED'; //TODO
})

// Export model
module.exports = mongoose.model('Owner', OwnerSchema);