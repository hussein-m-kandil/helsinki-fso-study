const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

console.log('Connecting to', process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 55000 })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error occurred while connecting to MongoDB:', error.message);
  });

const personSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is missing'],
      minLength: [3, 'name length must be 3 characters minimum!'],
    },
    number: {
      type: String,
      required: [true, 'number is missing'],
      minLength: [8, 'number length must be 8 characters minimum!'],
      validate: {
        validator: (v) => /(\d{2}-\d{5,})|(\d{3}-\d{4,})/.test(v),
        message: () => 'Invalid phone number! (xx-xxxxx or xxx-xxxx)',
      },
    },
  },
  { collection: 'persons' }
);

personSchema.set('toJSON', {
  transform(doc, { _id, name, number }) {
    // The auto created _id is an Object not a String
    return { id: _id.toString(), name, number };
  },
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
