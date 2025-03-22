import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useField = (name, type = 'text') => {
  const [value, setValue] = useState('');
  const onChange = (e) => setValue(e.target.value);
  return { type, name, value, onChange };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  const act = useCallback(
    (actor) => {
      return actor()
        .then(() => axios.get(baseUrl))
        .then((res) => setResources(res.data))
        .catch((error) => console.log(error.toString()));
    },
    [baseUrl],
  );

  useEffect(() => {
    act(() => Promise.resolve());
  }, [act]);

  const service = {
    create(resource) {
      return act(() => axios.post(baseUrl, resource));
    },
    delete(id) {
      return act(() => axios.delete(`${baseUrl}/${id}`));
    },
    update(id, newObject) {
      return act(() => axios.put(`${baseUrl}/${id}`, newObject));
    },
  };

  return [resources, service];
};

const App = () => {
  const [personToUpdate, setPersonToUpdate] = useState(null);
  const [noteToUpdate, setNoteToUpdate] = useState(false);

  const content = useField('content');
  const number = useField('number');
  const name = useField('name');

  const [notes, noteService] = useResource('/api/notes');
  const [persons, personService] = useResource('/api/persons');

  const resetNoteToUpdate = () => {
    setNoteToUpdate(null);
    content.onChange({ target: { value: '' } });
  };

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    event.target.submitter.disabled = true;
    const note = { content: content.value };
    (noteToUpdate
      ? noteService.update(noteToUpdate.id, note)
      : noteService.create(note)
    ).finally(() => {
      event.target.submitter.disabled = false;
      resetNoteToUpdate();
    });
  };

  const resetPersonToUpdate = () => {
    setPersonToUpdate(null);
    name.onChange({ target: { value: '' } });
    number.onChange({ target: { value: '' } });
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    event.target.submitter.disabled = true;
    const person = { name: name.value, number: number.value };
    (personToUpdate
      ? personService.update(personToUpdate.id, person)
      : personService.create(person)
    ).finally(() => {
      event.target.submitter.disabled = false;
      resetPersonToUpdate();
    });
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        {noteToUpdate ? (
          <>
            <button type="button" onClick={resetNoteToUpdate}>
              cancel
            </button>
            <button type="submit" name="submitter">
              update
            </button>
          </>
        ) : (
          <button type="submit" name="submitter">
            create
          </button>
        )}
      </form>
      {notes.map((n) => (
        <p key={n.id}>
          {n.content}&nbsp;
          <button
            type="button"
            disabled={!!noteToUpdate}
            onClick={() => {
              setNoteToUpdate(n);
              content.onChange({ target: { value: n.content } });
            }}
          >
            update
          </button>
          &nbsp;
          <button
            type="button"
            onClick={() => {
              if (noteToUpdate && noteToUpdate.id === n.id) {
                resetNoteToUpdate();
              }
              noteService.delete(n.id);
            }}
          >
            delete
          </button>
        </p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        {personToUpdate ? (
          <>
            <button type="button" onClick={resetPersonToUpdate}>
              cancel
            </button>
            <button type="submit" name="submitter">
              update
            </button>
          </>
        ) : (
          <button type="submit" name="submitter">
            create
          </button>
        )}
      </form>
      {persons.map((p) => (
        <p key={p.id}>
          {p.name} {p.number}&nbsp;
          <button
            type="button"
            disabled={!!personToUpdate}
            onClick={() => {
              setPersonToUpdate(p);
              name.onChange({ target: { value: p.name } });
              number.onChange({ target: { value: p.number } });
            }}
          >
            update
          </button>
          &nbsp;
          <button
            type="button"
            onClick={() => {
              if (personToUpdate && personToUpdate.id === p.id) {
                resetPersonToUpdate();
              }
              personService.delete(p.id);
            }}
          >
            delete
          </button>
        </p>
      ))}
    </div>
  );
};

export default App;
