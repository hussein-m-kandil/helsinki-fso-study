import { handleError } from "./utils";

export function calculateBmi(heightCM: number, weightKG: number): string {
  if (heightCM <= 0 || weightKG <= 0) {
    throw new Error("both inputs must be greater than zero");
  }
  if (!weightKG) throw new Error("the height in centimeters is missing");
  if (!weightKG) throw new Error("the wight in kilograms is missing");

  const heightM = heightCM / 100;
  const bmi = weightKG / Math.pow(heightM, 2);

  if (bmi < 18.5) return "underweight";
  if (bmi >= 18.5 && bmi < 25) return "normal weight";
  if (bmi >= 25 && bmi < 30) return "overweight";
  return "obese";
}

function main() {
  const heightCM = Number(process.argv[2]);
  const weightKG = Number(process.argv[3]);

  if (isNaN(heightCM)) {
    throw new Error("the height in centimeters (1st input) must be a number");
  }
  if (isNaN(weightKG)) {
    throw new Error("the weight in kilograms (2nd input) must be a number");
  }
  console.log(calculateBmi(heightCM, weightKG));
}

if (require.main === module) handleError(main);
