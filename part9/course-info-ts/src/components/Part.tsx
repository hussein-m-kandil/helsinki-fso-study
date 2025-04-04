import { CoursePart } from '../types';

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Description = ({ description }: { description: string }) => {
  return (
    <p>
      <em>{description}</em>
    </p>
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  return (
    <>
      <h2>
        {part.name} {part.exerciseCount}
      </h2>
      {(() => {
        switch (part.kind) {
          case 'basic':
            return <Description description={part.description} />;
          case 'background':
            return (
              <>
                <Description description={part.description} />
                <p>
                  see <a href={part.backgroundMaterial}>preparation material</a>
                </p>
              </>
            );
          case 'special':
            return (
              <>
                <Description description={part.description} />
                <p>required skills: {part.requirements.join(', ')}</p>
              </>
            );
          case 'group':
            return <p>project exercises {part.groupProjectCount}</p>;
          default:
            return assertNever(part);
        }
      })()}
    </>
  );
};

export default Part;
