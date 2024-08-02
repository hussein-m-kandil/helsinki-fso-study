const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.partInfo.name} {props.partInfo.exercises}
    </p>
  );
};

const Content = (props) => {
  return (
    <div>
      <Part partInfo={props.parts[0]} />
      <Part partInfo={props.parts[1]} />
      <Part partInfo={props.parts[2]} />
    </div>
  );
};

const Footer = (props) => {
  const parts = props.parts;
  return (
    <p>
      Number of exercises{" "}
      {parts[0].exercises + parts[1].exercises + parts[2].exercises}
    </p>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Footer parts={course.parts} />
    </div>
  );
};

export default App;
