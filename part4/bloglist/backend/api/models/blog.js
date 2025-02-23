const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    url: String,
    title: String,
    likes: Number,
    author: String,
  },
  {
    strictQuery: false,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    },
  },
);

module.exports = mongoose.model('Blog', blogSchema);
