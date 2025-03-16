import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAnecdotes } from './slices/anecdoteSlice.js';
import Notification from './components/Notification.jsx';
import AnecdoteForm from './components/AnecdoteForm.jsx';
import AnecdoteList from './components/AnecdoteList.jsx';
import Filter from './components/Filter.jsx';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  return (
    <>
      <h1>Anecdote App - Redux</h1>
      <Notification />
      <AnecdoteForm />
      <Filter />
      <AnecdoteList />
    </>
  );
};

export default App;
