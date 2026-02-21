const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analyze', async (req, res) => {
    try {
        const { sajuStr } = req.body;
        // ✅ Tier 1 등급이므로 가장 고성능인 1.5-pro 모델을 사용합니다.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const prompt = `입력된 정보: ${sajuStr}. 이 사람의 사주를 아주 전문적이고 풍성하게 한국어로 분석해줘.`;
        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (error) {
        // 유료 등급에서도 에러가 나면 상세 내용을 확인하기 위함입니다.
        res.status(500).json({ text: "AI 분석 실패: " + error.message });
    }
});

app.listen(process.env.PORT || 3000);
