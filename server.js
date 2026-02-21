const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai"); //

const app = express();
app.use(cors());
app.use(express.json());

// 1. 구글 AI 초기화 (치코리타님의 여의주 장착)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); //

// 2. 모델 설정 (models/ 없이 깔끔하게 설정)
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" 
}); //

app.post('/analyze', async (req, res) => {
    try {
        const { birthDate, birthTime, gender, isLunar } = req.body;
        
        // AI에게 줄 요청 (프롬프트)
        const prompt = `생년월일: ${birthDate}, 시간: ${birthTime}, 성별: ${gender}, 음력여부: ${isLunar}인 사람의 사주를 아주 자세하고 따뜻하게 분석해줘.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ result: text });
    } catch (error) {
        console.error("상세 에러 내용:", error);
        res.status(500).json({ 
            error: "사주 분석 중 에러가 발생했습니다.", 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 힘차게 돌아가고 있습니다!`);
});
