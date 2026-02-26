const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

app.post("/api/cosmos", async (req, res) => {
  try {
    const {
      frames,
      userPrompt,
      systemPrompt,
      temperature,
      topP,
      repetitionPenalty,
      maxTokens,
      seed,
    } = req.body || {};

    if (!Array.isArray(frames) || frames.length === 0) {
      return res.status(400).json({ error: "frames 배열이 비어 있습니다." });
    }

    if (!userPrompt || typeof userPrompt !== "string") {
      return res.status(400).json({ error: "userPrompt가 필요합니다." });
    }

    const baseUrl =
      process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com";
    const isLocalNim =
      baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!isLocalNim && !apiKey) {
      return res
        .status(500)
        .json({ error: "NVIDIA_API_KEY가 .env에 설정되어 있지 않습니다." });
    }

    const systemContent = systemPrompt
      ? [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: systemPrompt,
              },
            ],
          },
        ]
      : [];

    const imageContents = frames.map((dataUrl) => ({
      type: "image_url",
      image_url: { url: dataUrl },
    }));

    const body = {
      model: "nvidia/cosmos-reason1-7b",
      messages: [
        ...systemContent,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            ...imageContents,
          ],
        },
      ],
      temperature: typeof temperature === "number" ? temperature : 0.6,
      top_p: typeof topP === "number" ? topP : 0.95,
      repetition_penalty:
        typeof repetitionPenalty === "number" ? repetitionPenalty : 1.05,
      max_tokens: typeof maxTokens === "number" ? maxTokens : 256,
      seed: typeof seed === "number" ? seed : undefined,
    };

    const headers = { "Content-Type": "application/json" };
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      return res
        .status(response.status)
        .json({ error: "NVIDIA API 호출 실패", detail: text });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "서버 에러",
      detail: err && err.message ? err.message : String(err),
    });
  }
});

app.listen(PORT, () => {
  console.log(`bosch save 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
