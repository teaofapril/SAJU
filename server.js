const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// ✅ 모든 접속 허용 및 JSON 데이터 처리 설정
app.use(cors());
app.use(express.json());

// ✅ 환경 변수에서 유료 등급(Tier 1) API 키 로드
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ 주소창에 직접 접속(GET)했을 때 확인용 메시지
app.get('/', (req, res) => {
    res.send('치코리타님의 유료 서버가 아주 건강하게 가동 중입니다! 🐉 사주 분석 준비 완료!');
});

// ✅ 분석 요청 처리 (POST)
app.post('/analyze', async (req, res) => {
    try {
        const { sajuStr } = req.body;

        if (!sajuStr) {
            return res.status(400).json({ text: "사주 정보가 전달되지 않았습니다." });
        }

        // ✅ Tier 1 등급에서 가장 똑똑한 1.5-pro 모델 사용
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        // ✅ 시간이 없을 때를 대비한 맞춤형 프롬프트
        const prompt = `
            사용자 정보: ${sajuStr}
            
            위 정보를 바탕으로 한국 전통 사주(또는 삼주) 분석을 진행해줘.
            1. 성격의 특징과 강점
            2. 타고난 운의 흐름
            3. 현재 시기에 필요한 조언과 희망적인 메시지
            
            만약 시간이 '시간 모름'으로 되어 있다면, 태어난 연월일(삼주)을 중심으로 
            전문적이고 정성스럽게 분석해줘.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });
    } catch (error) {
        console.error("AI 에러 발생:", error);
        res.status(500).json({ text: "AI 분석 중 오류가 발생했습니다: " + error.message });
    }
});

// ✅ Render 환경의 포트 설정 (기본 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
