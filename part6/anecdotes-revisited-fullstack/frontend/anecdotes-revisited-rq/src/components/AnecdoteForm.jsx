import { useContext } from 'react';
import { postAnecdote } from '../requests.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NotificationContext from '../NotificationContext.js';
import truncStr from '../utils/truncStr.js';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({ mutationFn: postAnecdote });

  const { setNotification } = useContext(NotificationContext);

  const handleCreate = (e) => {
    e.preventDefault();
    const form = e.target;
    form.submitter.disabled = true;
    form.anecdote.focus();
    const newAnecdote = { votes: 0, content: form.anecdote.value.trim() };
    mutation.mutate(newAnecdote, {
      onSuccess: (savedAnecdote) => {
        const queryKey = ['anecdotes'];
        const anecdotes = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, anecdotes.concat(savedAnecdote));
        setNotification(`You created: ${truncStr(savedAnecdote.content)}`);
        form.anecdote.value = '';
      },
      onError: (error) => {
        setNotification(
          error.response?.data.error ||
            `Failed to create: ${truncStr(newAnecdote.content)}`
        );
        form.submitter.disabled = false;
      },
    });
  };

  const handleFormChange = (e) => {
    const form = e.currentTarget;
    form.submitter.disabled = !form.anecdote.value;
  };

  return (
    <form
      onSubmit={handleCreate}
      onChange={handleFormChange}
      aria-labelledby="new-anecdote-form-label"
      style={{ marginBlock: '1rem' }}
    >
      <h2
        id="new-anecdote-form-label"
        style={{ margin: 0, display: 'inline-block', fontSize: 'large' }}
      >
        New Anecdote
      </h2>
      <input
        type="text"
        name="anecdote"
        autoComplete="on"
        placeholder="Anecdote content..."
        style={{ margin: '0 0.5rem' }}
      />
      <button type="submit" name="submitter" disabled={true}>
        create
      </button>
    </form>
  );
};

export default AnecdoteForm;
