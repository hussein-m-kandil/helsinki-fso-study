import { CoursePart } from '../types';
import Part from './Part';

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return courseParts.map((cp) => <Part key={cp.name} part={cp} />);
};

export default Content;
