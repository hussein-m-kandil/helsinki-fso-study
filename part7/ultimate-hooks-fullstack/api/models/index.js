const mongoose = require('mongoose');

const schemaOptions = {
  strictQuery: false,
  toJSON: {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  },
};

module.exports = {
  Note: mongoose.model(
    'Note',
    new mongoose.Schema({ content: String }, schemaOptions),
  ),
  Person: mongoose.model(
    'Person',
    new mongoose.Schema({ name: String, number: String }, schemaOptions),
  ),
};
