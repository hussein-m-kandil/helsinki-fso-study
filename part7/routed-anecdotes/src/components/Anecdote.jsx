import { Navigate } from 'react-router-dom';

const Anecdote = ({ anecdote, onVote }) => {
  if (!anecdote) return <Navigate to="/" replace={true} />;
  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>
        <span style={{ verticalAlign: 'middle' }}>
          {anecdote.content} by {anecdote.author}{' '}
        </span>
        <button
          type="button"
          onClick={() => onVote(anecdote.id)}
          style={{ fontWeight: 'bold' }}
        >
          vote
        </button>
      </h2>
      <p style={{ marginTop: 0 }}>
        has {anecdote.votes} vote{anecdote.votes === 1 ? '' : 's'}
      </p>
      <p>
        for more info see <a href={anecdote.info}>{anecdote.info}</a>
      </p>
    </div>
  );
};

export default Anecdote;
