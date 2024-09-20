const mongoose = require('mongoose');
const path = require('path');

if (process.argv.length !== 3 && process.argv.length !== 5) {
  const runtimeCommand = path.basename(process.argv[0]);
  const thisFileName = path.basename(process.argv[1]);
  const neededArgs = '<db_password> [<new_entry_name> <new_entry_number>]';
  console.log(`Usage: ${runtimeCommand} ${thisFileName} ${neededArgs}`);
  process.exit(1);
}

const [dbPass, name, number] = process.argv.slice(2, 5);

const DB_NAME = 'phonebook';
const DB_ORIGIN = 'helsinki-fso-study.ghlxm.mongodb.net';
const DB_Query = 'retryWrites=true&w=majority&appName=helsinki-fso-study';
const MONGODB_URI = `mongodb+srv://kandil:${dbPass}@${DB_ORIGIN}/${DB_NAME}?${DB_Query}`;

mongoose.set('strictQuery', false);

mongoose.connect(MONGODB_URI).catch(console.log);

const personSchema = mongoose.Schema(
  {
    name: String,
    number: String,
  },
  { collection: 'persons' }
);

const Person = mongoose.model('Person', personSchema);

if (name) {
  const person = new Person({ name, number });
  person
    .save()
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
    })
    .catch(console.log)
    .finally(() => mongoose.connection.close());
} else {
  Person.find({})
    .then((persons) => {
      if (persons.length < 1) {
        console.log('The phonebook is empty!');
      } else {
        console.log('phonebook:');
        persons.forEach((p) => console.log(`    ${p.name} ${p.number}`));
      }
    })
    .catch(console.log)
    .finally(() => mongoose.connection.close());
}
