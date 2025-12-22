// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const hf = new HfInference(process.env.HF_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Summarize endpoint
app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    console.log("Received text:", text);

    const result = await hf.summarization({
      model: "facebook/bart-large-cnn",
      inputs: text,
      parameters: {
        max_length: 300,
        min_length: 50
      }
    });

    console.log("Summary result:", result);
    
    // Format response to match your expected format
    res.json([{ summary_text: result.summary_text }]);

  } catch (err) {
    console.error("Backend fetch error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch summary" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));