const express = require('express');
const morgan = require('morgan');
const path = require('path');
const Person = require('./models/Person');

morgan.token('body', (req) => JSON.stringify(req.body));

const app = express();

app.use(express.static(path.join(process.cwd(), 'public')));

app.use(morgan(':method :url :status :total-time ms :body\n-------'));

app.get('/info', (req, res) => {
  const date = new Date();
  let htmlRes = '<!DOCTYPE html><html lang="en">';
  htmlRes += '<head><meta charset="UTF-8" /><title>Phonebook</title></head>';
  htmlRes += '<body><h1>Phonebook</h1>';
  Person.find({})
    .then((persons) => {
      console.log('Respond with recent info');
      const len = persons.length;
      htmlRes += `<p>Phonebook has info for ${len} people</p><p>${date}</p></body></html>`;
    })
    .catch((error) => {
      console.log(
        'Error occurred while fetching persons from DB: ',
        error.message
      );
      htmlRes += `<p>Couldn't fetch phonebook info from db! Try again later.</p><p>${date}</p></body></html>`;
    })
    .finally(() => res.send(htmlRes));
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      console.log('Respond with all persons');
      res.json(persons);
    })
    .catch((error) => {
      console.log('Error occurred while fetching persons from DB');
      next(error);
    });
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        console.log('Respond with 404 Not Found');
        res.status(404).json({ error: 'Person Not Found' });
        return;
      }
      console.log('Respond with a person data');
      res.json(person);
    })
    .catch((error) => {
      console.log(
        `Error occurred while fetching person by id = ${req.params.id}`
      );
      next(error);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        console.log('Respond with nothing after a person have been deleted');
        res.status(204).end();
      } else {
        console.log('Respond with 404 No Such Person To Delete');
        res.status(404).json({ error: 'No such person to delete!' });
      }
    })
    .catch((error) => {
      console.log(
        `Error occurred while deleting person by id = ${req.params.id}`
      );
      next(error);
    });
});

app.use(express.json());

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;
  Person.find({ name })
    .then((result) => {
      if (result.length > 0) {
        console.log(
          'Respond with 400 with error message informs name must be unique'
        );
        res.status(400).json({ error: 'name must be unique' });
      } else {
        const newPerson = new Person({ name, number });
        newPerson
          .save()
          .then((savedPerson) => {
            console.log('Respond with newly added person');
            res.json(savedPerson);
          })
          .catch((error) => {
            console.log('Error occurred while creating a new person!');
            next(error);
          });
      }
    })
    .catch((error) => {
      console.log('Error occurred while finding a person with the same name!');
      next(error);
    });
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then((updatedPerson) => {
      // This function will be called with the updated value because of {new: true} option
      if (updatedPerson) {
        console.log('Respond with the updated person');
        res.json(updatedPerson);
      } else {
        console.log('Respond with 404 Not Found Person To Update');
        res.status(404).json({ error: 'Cannot find a person to update!' });
      }
    })
    .catch((error) => {
      console.log(
        `Error occurred while updating person by id = ${req.params.id}`
      );
      next(error);
    });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error);
  if (error.name === 'CastError') {
    res.status(400).json({ error: 'Malformed person id!' });
  } else if (error.name === 'ValidationError') {
    res.status(400).json({ error: error.message.replaceAll(/.*: /g, '') });
  } else if (error.status >= 400 && error.status < 500) {
    res.status(error.status).json({ error: error.message });
  } else {
    next(error);
  }
};

app.use(errorHandler);

if (!process.env.SERVERLESS_FUNCTION) {
  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`The app is running on port ${PORT}`));
}

module.exports = app;
