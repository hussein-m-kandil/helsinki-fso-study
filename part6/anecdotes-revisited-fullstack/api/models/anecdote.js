const mongoose = require('mongoose');

const anecdoteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'anecdote content is required'],
      minLength: [5, 'too short anecdote, must have length 5 or more'],
    },
    votes: Number,
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

module.exports = mongoose.model('Anecdote', anecdoteSchema);
