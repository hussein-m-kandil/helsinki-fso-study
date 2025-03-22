import { useRef, useState } from 'react';
import { Routes, Route, useNavigate, useMatch } from 'react-router-dom';
import CreateAnecdote from './components/CreateAnecdote.jsx';
import AnecdoteList from './components/AnecdoteList.jsx';
import Anecdote from './components/Anecdote.jsx';
import Footer from './components/Footer.jsx';
import About from './components/About.jsx';
import Menu from './components/Menu.jsx';

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1,
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2,
    },
  ]);

  const [notification, setNotification] = useState('');
  const notificationTimeoutIdRef = useRef(null);

  const showNotification = (message, timeoutMS = 5000) => {
    clearTimeout(notificationTimeoutIdRef.current);
    setNotification(message);
    notificationTimeoutIdRef.current = setTimeout(
      () => setNotification(''),
      timeoutMS
    );
  };

  const navigate = useNavigate();

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
    showNotification(`new anecdote added: ${anecdote.content}`);
    navigate('/');
  };

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);
    const votes = anecdote.votes + 1;
    const voted = {
      ...anecdote,
      votes,
    };
    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
    showNotification(
      `votes count increased to be ${votes} on: ${anecdote.content}`
    );
  };

  return (
    <div>
      <h1>Software anecdotes</h1>
      <div role="alert">
        {notification && (
          <div
            style={{
              border: '1px solid black',
              backgroundColor: '#fff',
              borderRadius: '0.5rem',
              position: 'fixed',
              padding: '1rem',
              width: '35%',
              top: '1rem',
              right: '1rem',
            }}
          >
            {notification}
          </div>
        )}
      </div>
      <Menu />
      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route
          path="/anecdotes/:id"
          element={
            <Anecdote
              anecdote={anecdoteById(
                Number(useMatch('/anecdotes/:id')?.params.id)
              )}
              onVote={vote}
            />
          }
        />
        <Route path="/create" element={<CreateAnecdote addNew={addNew} />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
