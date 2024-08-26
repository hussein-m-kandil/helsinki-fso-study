const Header = ({ course }) => {
  return <h2>{course}</h2>;
};

const Part = ({ partInfo }) => {
  return (
    <p>
      {partInfo.name} {partInfo.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return parts.map((part) => <Part key={part.id} partInfo={part} />);
};

const Footer = ({ parts }) => {
  const sum = parts.reduce((sum, { exercises }) => sum + exercises, 0);
  return (
    <p>
      <strong>{`total of ${sum} exercises`}</strong>
    </p>
  );
};

const Course = ({ course }) => {
  return (
    <div key={course.id}>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Footer parts={course.parts} />
    </div>
  );
};

export default Course;
