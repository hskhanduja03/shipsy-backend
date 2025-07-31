import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateQuestions = async (subject: string, level: string) => {
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
  }
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

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate quiz questions");
  }
};
