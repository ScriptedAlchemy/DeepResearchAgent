export type MemoryMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export class AgentMemory {
  private messages: MemoryMessage[] = [];

  constructor(public systemPrompt: string, public userPrompt?: string) {}

  addUserMessage(content: string) {
    this.messages.push({ role: 'user', content });
  }

  addAssistantMessage(content: string) {
    this.messages.push({ role: 'assistant', content });
  }

  toMessages(): MemoryMessage[] {
    const base: MemoryMessage[] = [{ role: 'system', content: this.systemPrompt }];
    if (this.userPrompt) {
      base.push({ role: 'user', content: this.userPrompt });
    }
    return base.concat(this.messages);
  }

  reset() {
    this.messages = [];
  }
}
