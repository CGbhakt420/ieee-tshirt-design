const express = require("express");
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

    const contentType = response.headers.get("content-type") || "";

    // ✅ Log the content type and response status for debugging
    console.log("HF Response:", response.status, contentType);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Hugging Face API error:", errorText);
      return res.status(response.status).send(errorText);
    }

    // ✅ If it’s an image
    if (contentType.includes("image")) {
      const arrayBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString("base64");
      const dataUrl = `data:image/png;base64,${base64Image}`;
      return res.json({ image: dataUrl });
    }

    // ⚠️ If it’s not an image (probably JSON error message)
    const json = await response.json();
    console.error("⚠️ Unexpected HF response:", json);
    return res.status(500).json({
      error: "Image generation failed",
      details: json,
    });
  } catch (error) {
    console.error("🔥 Server error:", error);
    res.status(500).json({ error: "Server error connecting to Hugging Face API" });
  }
});

module.exports = router;
