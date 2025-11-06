const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.post("/generate-image", async (req, res) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: req.body.inputs }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64Image}`;

    res.json({ image: dataUrl });
  } catch (error) {
    console.error("❌ Error generating image:", error);
    res.status(500).json({ error: "Server error connecting to Hugging Face API" });
  }
});

module.exports = router;
