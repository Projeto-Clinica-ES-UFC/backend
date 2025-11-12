import {GoogleGenAI} from "@google/genai";

export class LlmService {
  private model: GoogleGenAI;

  constructor(api_key: string) {
    this.model = new GoogleGenAI({apiKey: api_key});
  }

  async answer(prompt: string): Promise<string | undefined> {
    console.log("Prompt => ", prompt);
    const response = await this.model.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });
    console.log("Response => ", response.text);
    return response.text;
  }

}
