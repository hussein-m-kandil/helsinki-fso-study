import { useContext, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAnecdote, getAnecdotes, putAnecdote } from '../requests.js';
import NotificationContext from '../NotificationContext.js';
import truncStr from '../utils/truncStr.js';
import Filter from './Filter.jsx';

const AnecdoteList = () => {
  const anecdotesQueryKey = ['anecdotes'];

  const { isLoading, isSuccess, data } = useQuery({
    queryKey: anecdotesQueryKey,
    queryFn: getAnecdotes,
  });

  const [filter, setFilter] = useState('');

  const handleFilter = ({ target: filterInput }) => {
    setFilter(filterInput.value);
  };

  const sortedAnecdotes = useMemo(() => {
    if (!data) return null;
    return data
      .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => b.votes - a.votes);
  }, [data, filter]);

  const queryClient = useQueryClient();

  const voteMutation = useMutation({ mutationFn: putAnecdote });

  const deleteMutation = useMutation({ mutationFn: deleteAnecdote });

  const mutationDisabled = voteMutation.isPending || deleteMutation.isPending;

  const { setNotification } = useContext(NotificationContext);

  const createVoteHandler = (anecdote, downvote = false) => {
    if (downvote && anecdote.votes < 1) return;
    const votes = anecdote.votes + (downvote ? -1 : 1);
    const votedAnecdote = { ...anecdote, votes };
    return () => {
      voteMutation.mutate(votedAnecdote, {
        onSuccess: (savedAnecdote) => {
          const anecdotes = queryClient.getQueryData(anecdotesQueryKey);
          queryClient.setQueryData(
            anecdotesQueryKey,
            anecdotes.map((a) => {
              return a.id === savedAnecdote.id ? savedAnecdote : a;
            }),
          );
          setNotification(
            `You ${downvote ? 'down' : 'up'}voted for: ${truncStr(
              savedAnecdote.content,
            )}`,
          );
        },
        onError: () => {
          setNotification(
            `Failed to ${downvote ? 'down' : 'up'}vote for: ${truncStr(
              anecdote.content,
            )}`,
          );
        },
      });
    };
  };

  const createDeleteHandler = (anecdote) => {
    return () => {
      deleteMutation.mutate(anecdote.id, {
        onSuccess: () => {
          const anecdotes = queryClient.getQueryData(anecdotesQueryKey);
          queryClient.setQueryData(
            anecdotesQueryKey,
            anecdotes.filter((a) => {
              return a.id !== anecdote.id;
            }),
          );
          setNotification(`You deleted: ${anecdote.content}`);
        },
        onError: () => {
          setNotification(`Failed to delete: ${anecdote.content}`);
        },
      });
    };
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isSuccess) {
    return (
      <div style={{ color: 'a00' }}>
        Anecdotes service not available due to problems in server
      </div>
    );
  }

  return (
    <div>
      <Filter value={filter} onChange={handleFilter} />
      <ul>
        {sortedAnecdotes.map((a) => (
          <li key={a.id} style={{ marginBottom: '1rem' }}>
            <div
              style={{
                marginBottom: '0.5rem',
                fontStyle: 'italic',
                fontSize: 'large',
              }}
            >
              {a.content}
            </div>
            <div>
              has <strong>{a.votes} </strong>
              <button
                type="button"
                disabled={mutationDisabled}
                onClick={createVoteHandler(a)}
              >
                upvote
              </button>{' '}
              <button
                type="button"
                disabled={mutationDisabled || a.votes < 1}
                onClick={createVoteHandler(a, true)}
              >
                downvote
              </button>{' '}
              <button
                type="button"
                disabled={mutationDisabled}
                onClick={createDeleteHandler(a)}
              >
                delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnecdoteList;
