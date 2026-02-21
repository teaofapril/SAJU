const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 [보안 준수] API 키는 절대 코드에 직접 적지 않고 환경 변수에서 가져옵니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
    res.send('치코리타님의 유료 서버가 최신 보안 규격으로 가동 중입니다! 🐉');
});

app.post('/analyze', async (req, res) => {
    try {
        const { sajuStr } = req.body;

        // 🚀 [에러 방지] 모델 이름 앞에 'models/'를 명시하거나 최신 이름을 사용합니다.
        // Tier 1 등급에서 가장 안정적인 1.5-flash 모델을 명시적 경로로 호출합니다.
       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `사주 명리학 전문가로서 다음 정보를 분석해줘: ${sajuStr}. 한국어로 친절하게 설명해줘.`;

        // 최신 SDK 방식에 맞춘 콘텐츠 생성 호출
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ text: response.text() });

    } catch (error) {
        console.error("상세 에러 로그:", error);
        
        // 404 에러 발생 시 사용자에게 명확한 가이드 제공
        if (error.message.includes("404")) {
            res.status(404).json({ text: "모델을 찾을 수 없습니다. API 활성화 상태를 점검하세요." });
        } else {
            res.status(500).json({ text: "분석 중 오류가 발생했습니다: " + error.message });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Secure Server running on port ${PORT}`));


