const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/google-genai');
const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

const prompt = ai.definePrompt({
  name: 'testPrompt',
  prompt: 'Say hello!',
});

async function main() {
  try {
    const { text } = await prompt();
    console.log("Success:", text);
  } catch (e) {
    console.error("Genkit Error:", e.message);
    if (e.stack) console.error(e.stack);
  }
}
main();
