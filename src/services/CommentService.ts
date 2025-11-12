import {LlmService} from "@/services/LllmService";
import {HAS_INCIVILITY_PROMPT} from "@/utils/PromptManager";

export class CommentService {
  private llm_service: LlmService;

  constructor(llm_service: LlmService) {
    this.llm_service = llm_service;
  }


  public async hasIncivility(comment: string): Promise<boolean> {
    let response = await this.llm_service.answer(HAS_INCIVILITY_PROMPT.inject(comment))
    if (!response) {
      throw new Error("Failed to get response from LLM");
    }
    return JSON.parse(response);
  }

}
