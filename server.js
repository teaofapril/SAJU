const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ 이 부분이 있어야 "서버 정상" 문구가 뜹니다.
app.get('/', (req, res) => {
    res.send("서버 정상 가동 중! 🐉 치코리타님, 이제 주소 연결은 완벽해요!");
});

app.post('/analyze', async (req, res) => {
    try {
        // ✅ 404 에러를 피하기 위해 가장 확실한 모델명을 사용합니다.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const { sajuStr } = req.body;

        const result = await model.generateContent(sajuStr + " 이 사주를 분석해줘.");
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error("에러 발생:", error);
        res.status(500).json({ text: "AI 해독 중 오류: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
