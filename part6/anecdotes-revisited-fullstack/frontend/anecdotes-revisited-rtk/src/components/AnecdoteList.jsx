import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../slices/notificationSlice.js';
import { voteAnecdote } from '../slices/anecdoteSlice.js';
import truncStr from '../utils/truncStr.js';

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes }) => anecdotes);
  const filter = useSelector(({ filter }) => filter);

  const sortedAnecdotes = useMemo(() => {
    return anecdotes
      .filter((a) => a.content.includes(filter))
      .sort((a, b) => b.votes - a.votes);
  }, [anecdotes, filter]);

  const dispatch = useDispatch();

  const createVoter = (id, content) => () => {
    dispatch(voteAnecdote(id));
    dispatch(setNotification(`You voted for: ${truncStr(content)}`, 3000));
  };

  return (
    <ul>
      {sortedAnecdotes.map(({ id, content, votes }) => (
        <li key={id} style={{ marginBottom: '1rem' }}>
          <div
            style={{
              marginBottom: '0.5rem',
              fontStyle: 'italic',
              fontSize: 'large',
            }}
          >
            {content}
          </div>
          <div>
            has <strong>{votes} </strong>
            <button onClick={createVoter(id, content)}>vote</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AnecdoteList;
