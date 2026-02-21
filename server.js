const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors()); // ✅ 모든 접속 허용
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 메인 접속 확인
app.get('/', (req, res) => {
    res.send('서버 정상 가동 중! 🐉 치코리타님, 이제 주소 연결은 완벽해요!');
});

// 분석 요청 처리
app.post('/analyze', async (req, res) => {
    try {
        const { sajuStr } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(sajuStr + " 이 사주를 아주 상세하게 풀이해줘.");
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI 분석 실패" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
