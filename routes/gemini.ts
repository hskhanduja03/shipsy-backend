import express from "express";
import { generateQuestions } from "../utils/generateQuestions";

const router = express.Router();

router.post("/", async (req, res) => {
  const { subject, level } = req.body;

  if (!subject || !level) {
    return res.status(400).json({ error: "Subject and level are required." });
  }

  try {
    const questions = await generateQuestions(subject, level);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate questions." });
  }
});

export default router;
