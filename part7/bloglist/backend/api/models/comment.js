const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: String,
    blog: { ref: 'Blog', type: mongoose.Schema.Types.ObjectId },
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

module.exports = mongoose.model('Comment', commentSchema);
