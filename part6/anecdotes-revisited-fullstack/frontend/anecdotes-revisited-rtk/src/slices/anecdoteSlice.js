import { createSlice } from '@reduxjs/toolkit';
import anecdotesService from '../services/anecdotes.js';

const { reducer, actions } = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    setAnecdotes(state, { payload: anecdotes }) {
      return anecdotes;
    },
    appendAnecdote(state, { payload: anecdote }) {
      return [...state, anecdote];
    },
    voteAnecdote(state, { payload: votedAnecdote }) {
      return state.map((anecdote) =>
        anecdote.id === votedAnecdote.id ? votedAnecdote : anecdote,
      );
    },
  },
});

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll();
    return dispatch(actions.setAnecdotes(anecdotes));
  };
};

export const addAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = { votes: 0, content };
    const savedAnecdote = await anecdotesService.postOne(newAnecdote);
    return dispatch(actions.appendAnecdote(savedAnecdote));
  };
};

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState();
    const anecdote = anecdotes.find((a) => a.id === id);
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const votedAnecdote = await anecdotesService.putOne(updatedAnecdote);
    return dispatch(actions.voteAnecdote(votedAnecdote));
  };
};

export default reducer;
