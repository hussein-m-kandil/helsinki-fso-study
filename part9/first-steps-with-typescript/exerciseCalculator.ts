import { handleError } from "./utils";

interface ExerciseCalculation {
  ratingDescription: string;
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  target: number;
  average: number;
}

export function calculateExercises(
  exerciseHours: number[],
  target: number
): ExerciseCalculation {
  if (!exerciseHours.length) {
    throw new Error("missing exercise hours for at least 1 day");
  }

  const periodLength: number = exerciseHours.length;
  const trainingDays: number = exerciseHours.reduce(
    (acc, hrs) => (hrs > 0 ? acc + 1 : acc),
    0
  );
  const sumExerciseHours: number = exerciseHours.reduce(
    (sum, hrs) => sum + hrs,
    0
  );
  const average = sumExerciseHours / periodLength;
  const success = average >= target;
  const absDiff = Math.abs(average - target);
  const overhead = target * 0.1;
  const rating =
    success && absDiff > overhead ? 3 : !success && absDiff > overhead ? 1 : 2;
  const ratingDescription = (() => {
    switch (rating) {
      case 3:
        return "excellent, you are putting great effort!";
      case 1:
        return "too bad, you should put more effort";
      default:
        return "not too bad but could be better";
    }
  })();

  return {
    ratingDescription,
    periodLength,
    trainingDays,
    success,
    rating,
    target,
    average,
  };
}

function main() {
  const target = Number(process.argv[2]);
  const exerciseHours = process.argv.slice(3).map((n) => Number(n));

  if (isNaN(target) || exerciseHours.some((n) => isNaN(n))) {
    throw new Error("expect all inputs to be numbers");
  }

  console.log(calculateExercises(exerciseHours, target));
}

handleError(main);

// console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
