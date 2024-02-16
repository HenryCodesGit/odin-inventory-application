#! /usr/bin/env node

// Specified database as argument
// e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
console.log(
    'This script populates some test owners, listings, and categories to the database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Category = require("./models/category");
  const Listing = require("./models/listing");
  const Owner = require("./models/owner");

  const categories = [];
  const listings = []
  const owners = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createOwners();
    await createListings();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // category[0] will always be the electronics category, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, name) {
    const category = new Category({ name: name });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }
  
  async function ownerCreate(index, name, date_created, email) {
    const ownerdetail = { name, date_created};
    if (email != false) ownerdetail.email = email;
  
    const owner = new Owner(ownerdetail);
  
    await owner.save();
    owners[index] = owner;
    console.log(`Added owner: ${name}`);
  }
  
  async function listingCreate(index, name, price, date_posted, owner, category, details) {
    const listingdetail = {
      name, price, date_posted, owner, category
    };
    if (details != false) listingdetail.details = details;
  
    const listing = new Listing(listingdetail);
    await listing.save();
    listings[index] = listing;
    console.log(`Added listing: ${name}`);
  }

  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate(0, "Books"),
      categoryCreate(1, "Video Games & Consoles"),
      categoryCreate(2, "Computers"),
      categoryCreate(3, "Phones"),
      categoryCreate(4, "Furniture"),
    ]);
  }

  async function createOwners() {
    console.log("Adding owners");
    await Promise.all([
      ownerCreate(0,"John Smith",new Date('2000-01-02'),'johnsmith@yahoo.ca'),
      ownerCreate(1,"Mike Hunt",new Date('2003-03-21'),false),
      ownerCreate(2,"Jennifer Bailey",new Date('2014-10-08'),'jbailey@gmail.com'),
      ownerCreate(3,"Aaron Wilson",new Date('2022-04-16'),'aaronw@hotmail.com'),
      ownerCreate(4,"Wendy Horton",new Date('2017-01-01'),),
    ]);
  }

  async function createListings() {
    console.log("Adding categories");
    await Promise.all([
      listingCreate(0, "The Bible (Mint Condition)",777,new Date('2023-12-25'),owners[1],categories[0],'This is the bible'),
      listingCreate(1, "The Necronomicon (Mint Condition)",666,new Date('2023-10-31'),owners[1],categories[0],'This is not the bible'),
      listingCreate(2, "PS5",555,new Date('2024-01-10'),owners[0],categories[1],`Mint condition PS5. I swear that I'm not scalping`),
      listingCreate(3, "Xbox Series X One",111,new Date('2024-01-11'),owners[2],categories[1],`Xbox One S Series X Elite 2. Yes I am confused too`),
      listingCreate(4, "Nintendo Switch",222,new Date('2023-06-07'),owners[3],categories[1],`Nintendo Switch. Used once.`),
      listingCreate(5, "Laptop",123,new Date('2023-04-12'),owners[4],categories[2],false),
      listingCreate(6, "iPhone Original",10000,new Date('2023-03-13'),owners[0],categories[3],false),
      listingCreate(7, "Chair",5,new Date('2023-02-14'),owners[2],categories[4],false),
    ]);
  }