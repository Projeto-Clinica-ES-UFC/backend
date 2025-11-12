class Prompt {
  protected base_text: string;

  constructor(base: string) {
    this.base_text = base;
  }

  public inject(text: string): string {
    return this.base_text + text;
  }
}


export const HAS_INCIVILITY_PROMPT = new Prompt("Verify this comment to see if it contains incivility, return only one word (true or false):");
