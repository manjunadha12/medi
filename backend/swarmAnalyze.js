import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

// Using fast and reliable models.
const MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "openrouter/free"
];

export async function swarmAnalyze({ prompt, imageBase64, mimeType, systemPrompt }) {
  if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY missing");

  const hasImage = Boolean(imageBase64);

  for (const model of MODELS) {
    try {
      console.log(`Swarm: Accessing Neural Node -> ${model}`);

      // Smart system instructions: use provided prompt or default to medical extraction
      const systemContent = systemPrompt || "You are a professional medical data extraction engine. You MUST return ONLY a valid JSON string. Do not include markdown code blocks. Extract all relevant clinical or institutional data into the requested JSON schema.";

      const messages = [
        { role: "system", content: systemContent },
        {
          role: "user",
          content: hasImage
            ? [
                { type: "text", text: "Parse this clinical report into JSON format immediately: " + (prompt || "") },
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
              ]
            : prompt
        }
      ];

      const controller = new AbortController();
      // Reduced timeout to 15s to switch models faster if one is slow or congested
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://mediconsult-backend-w2sn.onrender.com",
          "X-Title": "Medi Consult Ultra"
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.1
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.warn(`Node ${model} failed: ${errData.error?.message || response.statusText}`);
        continue;
      }

      const data = await response.json();
      let answer = data?.choices?.[0]?.message?.content;

      if (answer && answer.length > 5) {
        // Cleanup JSON
        answer = answer.replace(/```json/g, '').replace(/```/g, '').trim();

        // Smart Extraction for both Arrays and Objects
        const firstBrace = answer.indexOf('{');
        const firstBracket = answer.indexOf('[');
        let start = -1;
        let end = -1;

        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
            start = firstBrace;
            end = answer.lastIndexOf('}') + 1;
        } else if (firstBracket !== -1) {
            start = firstBracket;
            end = answer.lastIndexOf(']') + 1;
        }

        if (start !== -1 && end > start) {
            answer = answer.substring(start, end);
        }

        console.log(`Node ${model} SYNC_SUCCESS.`);
        return answer;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`Node ${model} TIMEOUT (25s).`);
      } else {
        console.error(`Node ${model} ERROR:`, error.message);
      }
    }
  }

  // Improved Fallback
  return JSON.stringify({
    error: "Swarm nodes busy",
    message: "Protocol timeout. Please try again."
  });
}
