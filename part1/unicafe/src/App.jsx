import { useState } from "react";

const Head = ({ text }) => {
  return <h1>{text}</h1>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  if (good > 0 || neutral > 0 || bad > 0) {
    const all = good + neutral + bad;
    const average = (good + bad * -1) / all;
    const positivePercentage = (good / all) * 100;
    return (
      <table>
        <tbody>
          <StatisticLine text={"good"} value={good} />
          <StatisticLine text={"neutral"} value={neutral} />
          <StatisticLine text={"bad"} value={bad} />
          <StatisticLine text={"all"} value={all} />
          <StatisticLine text={"average"} value={average} />
          <StatisticLine text={"positive"} value={`${positivePercentage} %`} />
        </tbody>
      </table>
    );
  } else {
    return <div>No feedback given</div>;
  }
};

const Button = ({ text, onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const updateState = (value, setter) => () => setter(value + 1);

  return (
    <div>
      <Head text={"give feedback"} />
      <Button text={"good"} onClick={updateState(good, setGood)} />
      <Button text={"neutral"} onClick={updateState(neutral, setNeutral)} />
      <Button text={"bad"} onClick={updateState(bad, setBad)} />
      <Head text={"statistics"} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
