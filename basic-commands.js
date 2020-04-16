// show dbs
// use database

// Inset A Document
//  Syntax db.collection_name.insert(BSON)

db.unicorns.insert({ name: "x", gender: "y", age: 2 });

// Find All Documents
db.unicorns.find();

// Pretty Print
db.unicorns.find().pretty();

// get Indexes
db.unicorns.getIndexes();

// Mastering Selectors

// Operators $lt $gt $lte $gte $ne [less than][greater than][less than equal][greater than equal][not equal]

// Find Documents Whose gender:'m' and weight less than 700
db.unicorns.find({ gender: "m", weight: { $lt: 700 } });

// $exists operator to check for a field
db.unicorns.find({ vampires: { $exists: true } }).pretty();

// In Operator For Multiple Checks
db.unicorns.find({ loves: { $in: ["apple", "orange"] } }).pretty();

// Or Several Conditions
db.unicorns
  .find({ $or: [{ loves: { $in: ["apple"] } }, { gender: "f" }] })
  .pretty();

// Updating

// Set Will Not Replace the entire document it will update specified fields
db.unicorns.update(
  { name: "Rood" },
  {
    $set: {
      name: "Roooooodles",
      dob: new Date(1979, 7, 18, 18, 44),
      loves: ["apple"],
      gender: "m",
      vampires: 99,
    },
  }
);

// $inc operator

db.unicorns.update({ name: "Pilot" }, { $inc: { vampires: -2 } });

// $push operator to push the value to array field
db.unicorns.update({ name: "Pilot" }, { $push: { loves: "Banana" } });

// Upseting Create Document if not found

db.hits.update({ page: "unicorns" }, { $inc: { hits: 1 } });

// {upsert: true} as third arg
db.hits.update({ page: "unicorns" }, { $inc: { hits: 1 } }, { upsert: true });

// Multiple Updates

// Normal
db.unicorns.update({}, { $set: { vaccinated: true } });

// Multi Update
db.unicorns.update({}, { $set: { vaccinated: true } }, { multi: true });

db.unicorns.find({ vaccinated: true });

// Projection | getting only fields that you want
db.unicorns.find({}, { name: 1 });

// Without retrieving the ID
db.unicorns.find({}, { name: 1, _id: 0 });

// ORDERING

// -1 for descending
// 1 for ascending

// desc
db.unicorns.find().sort({ weight: -1 });

db.unicorns.find().sort({ name: 1, vampires: -1 });

// PAGING
// by limit and skip functions

db.unicorns.find().sort({ weight: -1 }).limit(2).skip(1);

// COUNT
db.unicorns.count({ vampires: { $gt: 50 } });

db.unicorns.find({ vampires: { $gt: 50 } }).count();

// DATA MODELLING

// Many To Many

// store multiple keys in an array
// store embedded doc in an array

// Denormailzation

// data is snapshoted like a audit log

// Current MongoDB Doc Size is 16 MB

// Capped Collection defining a size of doc 1MB
db.createCollection("logs", { capped: true, size: 1048576 });

// GEO SPACIAL SEARCH

// Aggregation Pipeline
db.unicorns.aggregate([{ $group: { _id: "$gender", total: { $sum: 1 } } }]);

db.unicorns.aggregate([
  { $match: { weight: { $lt: 600 } } },
  {
    $group: {
      _id: "$gender",
      total: { $sum: 1 },
      avgVamp: { $avg: "$vampires" },
    },
  },
  { $sort: { avgVamp: -1 } },
]);

db.unicorns.aggregate([
  { $unwind: "$loves" },
  {
    $group: {
      _id: "$loves",
      total: { $sum: 1 },
      unicorns: { $addToSet: "$name" },
    },
  },
  { $sort: { total: -1 } },
  { $limit: 1 },
]);

// Indexing

db.unicorns.ensureIndex({ name: 1 });
db.unicorns.dropIndex({ name: 1 });

db.unicorns.ensureIndex({ name: 1 }, { unique: true });

// EXPLAIN

db.unicorns.find().explain();
