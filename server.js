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
// server.js 의 해당 부분을 아래와 같이 수정하세요.

app.post('/analyze', async (req, res) => {
    try {
        const { sajuStr } = req.body;

        // ✅ 모델 선언부 수정: 'models/'를 생략하거나 명확히 지정합니다.
        // 유료 등급(Tier 1)이므로 가장 안정적인 1.5-flash를 사용합니다.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        
        const prompt = `사주 정보: ${sajuStr}. 이 데이터를 바탕으로 전문적인 사주 풀이를 한국어로 작성해줘.`;

        // ✅ API 호출 시 버전 호환성을 위해 아래와 같이 처리합니다.
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ text: response.text() });

    } catch (error) {
        console.error("상세 에러:", error);
        res.status(500).json({ text: "AI 서비스 응답 지연 또는 설정 오류입니다. 잠시 후 다시 시도해주세요." });
    }
});

// ✅ Render 환경의 포트 설정 (기본 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


