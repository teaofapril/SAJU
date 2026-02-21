const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// ✅ 설정 1. 보안 및 데이터 파싱 (CORS 에러 방지)
app.use(cors());
app.use(express.json());

// ✅ 설정 2. API 키 로드 및 초기화
// Render의 Environment Variables에 GEMINI_API_KEY가 정확히 등록되어 있어야 합니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ 설정 3. 서버 생존 확인용 (주소창에 쳤을 때 보이는 화면)
app.get('/', (req, res) => {
    res.send('치코리타님의 유료 서버가 404를 뚫고 정상 가동 중입니다! 🐉');
});

// ✅ 설정 4. 사주 분석 핵심 로직
app.post('/analyze', async (req, res) => {
    try {
        const { sajuStr } = req.body;

        if (!sajuStr) {
            return res.status(400).json({ text: "사주 정보가 누락되었습니다." });
        }

        // ✅ 유료(Tier 1) 등급에서 가장 에러 없이 안정적인 flash 모델 사용
        // 만약 계속 404가 뜨면 구글 클라우드에서 'Generative Language API' 활성화를 꼭 확인해야 합니다.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
            입력된 사주 정보: ${sajuStr}
            
            당신은 최고의 사주 명리학 전문가입니다. 
            위의 생년월일시 정보를 바탕으로 다음 내용을 한국어로 정성껏 분석해 주세요:
            1. 타고난 기운과 성격 특징
            2. 재물운과 직업운의 흐름
            3. 올해의 전반적인 운세와 따뜻한 조언
            
            *만약 시간이 '시간 모름'이라면 태어난 날짜(삼주)를 중심으로 깊이 있게 분석해 주세요.
        `;

        // ✅ API 호출 (비동기 처리)
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // ✅ 결과 전송
        res.json({ text: text });

    } catch (error) {
        console.error("AI API 에러 발생:", error);
        
        // 에러 메시지에 따라 사용자에게 힌트 제공
        let errorMessage = "분석 중 오류가 발생했습니다.";
        if (error.message.includes("404")) {
            errorMessage = "API 모델을 찾을 수 없습니다. (구글 콘솔에서 API 활성화 상태를 확인해 주세요)";
        } else if (error.message.includes("429")) {
            errorMessage = "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
        }
        
        res.status(500).json({ text: errorMessage + " 상세: " + error.message });
    }
});

// ✅ 설정 5. 포트 개방
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. Ready to analyze!`);
});
