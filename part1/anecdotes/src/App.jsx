import { useState } from "react";

const Head = ({ text }) => {
  return <h1>{text}</h1>;
};

const Button = ({ text, onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  );
};

const Anecdote = ({ anecdote, voteCount }) => {
  return (
    <>
      <div>{anecdote}</div>
      <div>has {voteCount} votes</div>
    </>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const getTopAnecdote = (selected, votes) => {
    // Initially select the already selected anecdote
    let topIndex = selected;
    let topAnecdote = anecdotes[topIndex];
    let topIndexes = [topIndex];
    let topVoteCount = votes[topIndex];
    // Search for the highest number of votes and save all indexes has same number of votes
    votes.forEach((voteCount, i) => {
      if (voteCount > topVoteCount) {
        topVoteCount = voteCount;
        topIndexes = [i];
      } else if (voteCount === topVoteCount) {
        topIndexes = [...topIndexes, i];
      }
    });
    // Choose random index from the indexes of the top voted anecdotes, if any
    if (topIndexes.length > 0) {
      const randomIndex = Math.floor(Math.random() * topIndexes.length);
      topIndex = topIndexes[randomIndex];
      topAnecdote = anecdotes[topIndex];
    }
    return [topAnecdote, topIndex];
  };

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(anecdotes.map(() => 0));
  const [topAnecdote, topIndex] = getTopAnecdote(selected, votes);

  const handleVoting = () => {
    const newVotes = [...votes];
    newVotes[selected]++;
    setVotes(newVotes);
  };

  const handleGenRandAnecdote = () => {
    // Select random anecdote, other than the currently selected one
    let toBeSelected = selected;
    do {
      toBeSelected = Math.floor(Math.random() * anecdotes.length);
    } while (toBeSelected === selected);
    setSelected(toBeSelected);
  };

  return (
    <>
      <Head text={"Anecdote of the day"} />
      <Anecdote anecdote={anecdotes[selected]} voteCount={votes[selected]} />
      <Button text={"vote"} onClick={handleVoting} />
      <Button text={"next anecdote"} onClick={handleGenRandAnecdote} />
      <Head text={"Anecdote with most votes"} />
      <Anecdote anecdote={topAnecdote} voteCount={votes[topIndex]} />
    </>
  );
};

export default App;
