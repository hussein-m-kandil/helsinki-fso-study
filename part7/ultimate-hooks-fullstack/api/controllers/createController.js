function createController(dbModel) {
  const router = require('express').Router();

  router.get('/', async (req, res) => {
    const anecdotes = await dbModel.find({});
    res.json(anecdotes);
  });

  router.get('/:id', async (req, res) => {
    const anecdote = await dbModel.findById(req.params.id);
    if (anecdote) res.json(anecdote);
    else res.status(404).end();
  });

  router.post('/', async (req, res) => {
    const savedAnecdote = await new dbModel(req.body).save();
    res.status(201).json(savedAnecdote);
  });

  const updateHandler = async (req, res) => {
    const savedAnecdote = await dbModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (savedAnecdote) res.json(savedAnecdote);
    else res.status(404).end();
  };

  router.patch('/:id', updateHandler);

  router.put('/:id', updateHandler);

  router.delete('/:id', async (req, res) => {
    await dbModel.findByIdAndDelete(req.params.id);
    res.status(204).end();
  });

  return router;
}

module.exports = createController;
