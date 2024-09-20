const Person = ({ id, name, number, onDelete }) => {
  return (
    <div>
      {`${name} ${number}`}&nbsp;
      <button type="button" onClick={() => onDelete(id)}>
        delete
      </button>
    </div>
  );
};

const Persons = ({ persons, onDelete }) => {
  return persons.map((p) => <Person key={p.id} {...p} onDelete={onDelete} />);
};

export default Persons;
