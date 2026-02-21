const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// 환경변수에 저장된 API 키를 불러옵니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
    res.send('서버 정상 가동 중! 🐉');
});

app.post('/analyze', async (req, res) => {
    try {
        const { sajuStr } = req.body;
        // ✅ 모델 이름을 최신 버전인 gemini-1.5-flash로 변경했습니다.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `생년월일시: ${sajuStr}. 이 사주를 가진 사람의 특징과 운세를 아주 상세하게 한국어로 설명해줘.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ text: "AI 분석 실패: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
