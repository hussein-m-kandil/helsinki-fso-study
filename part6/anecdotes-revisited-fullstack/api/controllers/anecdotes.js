const anecdotesRouter = require('express').Router();
const Anecdote = require('../models/anecdote.js');

anecdotesRouter.get('/', async (req, res) => {
  const anecdotes = await Anecdote.find({});
  res.json(anecdotes);
});

anecdotesRouter.get('/:id', async (req, res) => {
  const anecdote = await Anecdote.findById(req.params.id);
  if (anecdote) res.json(anecdote);
  else res.status(404).end();
});

anecdotesRouter.post('/', async (req, res) => {
  const savedAnecdote = await new Anecdote(req.body).save();
  res.status(201).json(savedAnecdote);
});

const updateHandler = async (req, res) => {
  const savedAnecdote = await Anecdote.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (savedAnecdote) res.json(savedAnecdote);
  else res.status(404).end();
};

anecdotesRouter.patch('/:id', updateHandler);

anecdotesRouter.put('/:id', updateHandler);

anecdotesRouter.delete('/:id', async (req, res) => {
  await Anecdote.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = anecdotesRouter;
