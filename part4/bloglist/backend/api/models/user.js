const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    passHash: String,
    username: { type: String, required: true, unique: true },
    blogs: [{ ref: 'Blog', type: mongoose.Schema.Types.ObjectId }],
  },
  {
    strictQuery: false,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.passHash;
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    },
  },
);

module.exports = mongoose.model('User', userSchema);
