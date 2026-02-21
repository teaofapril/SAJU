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
        if (!sajuStr || sajuStr.trim() === "") {
            return res.json({ text: "입력된 정보가 없습니다. 날짜와 시간을 확인해주세요." });
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // 질문을 더 명확하게 수정
        const prompt = `생년월일시: ${sajuStr}. 이 사람의 사주와 신년 운세를 아주 친절하고 상세하게 한국어로 설명해줘.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ text: text || "AI가 분석 내용을 생성하지 못했습니다. 잠시 후 다시 시도해주세요." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ text: "AI 통신 에러: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

