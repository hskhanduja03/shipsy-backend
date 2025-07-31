// backend/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


app.post("/api/generate", async (req, res) => {
  const { subject, level } = req.body;

  const prompt = `
Generate 10 multiple choice questions about ${subject} at ${level} level.

Each question should have:
- A question string
- 4 options in an array
- An index (0–3) of the correct option
- An explanation

Return ONLY a JSON array like this:
[
  {
    "id": 1,
    "question": "What is the powerhouse of the cell?",
    "options": ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
    "correctAnswer": 2,
    "explanation": "Mitochondria produce ATP and are known as the powerhouse of the cell."
  },
  ...
]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    text = text.replace(/```json|```/g, "");

    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);

    const questions = JSON.parse(jsonString);
    res.json(questions);
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
