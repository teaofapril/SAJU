const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// API 키는 Render 환경변수에서 읽어옵니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analyze', async (req, res) => {
  try {
    const { sajuStr } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptText = `명리학자로서 사주 데이터: ${sajuStr}를 정밀 분석하라.
    2026년 운세 중심으로, 고정된 비유(흑룡, 장미) 없이 이 원국에 맞는 새로운 자연 비유를 창조하라.
    마지막 '맞춤 개운법'에는 반드시 바다, 강 등 '물의 기운'을 가까이 할 것과 물의 기운을 가진 귀인을 만날 것을 포함하라.`;

    const result = await model.generateContent(promptText);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running!`));




