import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (isNaN(height) || isNaN(weight)) {
    res.status(400).json({
      error: "both height and weight are required and must be numbers!",
    });
  } else {
    try {
      res.json({ height, weight, bmi: calculateBmi(height, weight) });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "something wrong" });
      }
    }
  }
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises } = req.body;

  if (!target || !daily_exercises) {
    res.status(400).json({ error: "parameters missing" });
  } else if (!Array.isArray(daily_exercises)) {
    res.status(400).json({ error: "malformed parameters" });
  } else {
    const targetAmount = Number(target);
    const exerciseHours = daily_exercises.map((h) => +h);
    if (isNaN(targetAmount) || exerciseHours.some((h) => isNaN(h))) {
      res.status(400).json({ error: "malformed parameters" });
    } else {
      try {
        res.json(calculateExercises(exerciseHours, targetAmount));
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: "something wrong" });
        }
      }
    }
  }
});

const PORT = 3003;
app.listen(PORT, () => console.log(`running on port ${PORT}`));
