import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import personService from "./services/persons";
import PersonForm from "./components/PersonForm";
import Notification from "./components/Notification";

const App = () => {
  const [filterValue, setFilterValue] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  console.log(
    `%cRendering with %c${persons.length}%c saved number${
      persons.length === 1 ? "" : "s"
    }...`,
    "color: green",
    "color: orange",
    "color: green"
  );

  // Fetch persons from the running json-server
  useEffect(() => {
    personService
      .getAll()
      .then((persons) => {
        console.log(
          "%cUpdating state with the fetched persons...",
          "color: orange"
        );
        setPersons(persons);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("%cFetching persons...", "color: orange");
  }, []);

  // Clear notification message
  useEffect(() => {
    if (message) {
      const timeoutId = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [message]);

  const filterPersons = () => {
    return persons.filter(({ name }) =>
      name.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  const showMessage = (msg, err = false) => {
    setError(err);
    setMessage(msg);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Skip if empty name/number
    if (newName && newNumber) {
      const person = persons.find(
        ({ name }) => name.toLowerCase() === newName.toLowerCase()
      );
      if (person) {
        if (
          confirm(
            `${person.name} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          console.log(
            `%cUpdating ${person.name}'s number on the server...`,
            "color: orange"
          );
          const updatedPerson = { ...person, number: newNumber };
          personService
            .update(person.id, updatedPerson)
            .then((data) => {
              if (data && data.error) {
                showMessage(data.error, true);
              } else if (data.id) {
                const receivedPerson = data;
                showMessage(`${receivedPerson.name}'s number updated!`);
                setPersons(
                  persons.map((p) =>
                    p.id === receivedPerson.id ? receivedPerson : p
                  )
                );
              } else {
                showMessage("Something wrong! Try again later.", true);
              }
            })
            .catch((error) => {
              console.log(error);
              if (error.response && error.response.status === 404) {
                showMessage(
                  `Information of ${updatedPerson.name} has already been removed from server!`,
                  true
                );
                setPersons(persons.filter((p) => p.id !== updatedPerson.id));
              } else {
                showMessage(
                  error.response?.data.error ||
                    "Something wrong! Try again later.",
                  true
                );
              }
            });
          setNewNumber("");
          setNewName("");
        }
      } else {
        const newPerson = { name: newName, number: newNumber };
        console.log("%cSending new person to the server...", "color: orange");
        personService
          .add(newPerson)
          .then((data) => {
            if (data && data.error) {
              showMessage(data.error, true);
            } else if (data.id) {
              const receivedPerson = data;
              showMessage(`${receivedPerson.name} added!`);
              setPersons(persons.concat(receivedPerson));
              setNewNumber("");
              setNewName("");
            } else {
              showMessage("Something went wrong! Try again later.", true);
            }
          })
          .catch((error) => {
            showMessage(
              error.response?.data.error || "Something wrong! Try again later.",
              true
            );
            console.log(error);
          });
      }
    }
  };

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (confirm(`Delete ${person.name}`)) {
      console.log(`%cDeleting (${person.name})...`, "color: orange");
      personService
        .del(id)
        .then(() => {
          showMessage(`${person.name} deleted!`);
          setPersons(persons.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 404) {
            showMessage("Cannot delete an already deleted person!", true);
          } else {
            showMessage("Something went wrong! Try again later.", true);
          }
        });
    } else {
      console.log(`Deleting (${person.name}) is canceled!`);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} className={error ? "error" : "notify"} />
      <Filter
        filterValue={filterValue}
        onFilter={(e) => setFilterValue(e.target.value)}
      />
      <h3>Add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        onChangeName={(e) => setNewName(e.target.value)}
        onChangeNumber={(e) => setNewNumber(e.target.value)}
        onSubmit={handleSubmit}
      />
      <h3>Numbers</h3>
      {persons.length > 0 ? (
        <Persons
          persons={filterValue ? filterPersons() : persons}
          onDelete={handleDelete}
        />
      ) : (
        <div>Added phone numbers will be presented here!</div>
      )}
    </div>
  );
};

export default App;