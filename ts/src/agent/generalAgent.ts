import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { Agent, computerTool, run } from '@openai/agents';
import { BrowserComputer } from '../computer.js';
import { AgentMemory } from './memory.js';

export interface GeneralAgentConfig {
  name: string;
  model: string;
  templatePath: string;
}

export class GeneralAgent {
  private templates: any;
  public memory: AgentMemory;

  constructor(private cfg: GeneralAgentConfig, private computer: BrowserComputer) {
    const templateAbs = path.resolve(cfg.templatePath);
    const raw = fs.readFileSync(templateAbs, 'utf-8');
    this.templates = yaml.parse(raw);
    const systemPrompt = this.templates.system_prompt as string;
    const userPrompt = this.templates.user_prompt as string | undefined;
    this.memory = new AgentMemory(systemPrompt, userPrompt);
  }

  private formatTask(task: string): string {
    const tpl: string = this.templates.task_instruction || '{{task}}';
    return tpl.replace('{{task}}', task);
  }

  async run(task: string): Promise<string> {
    const agent = new Agent({
      name: this.cfg.name,
      model: this.cfg.model,
      instructions: this.memory.systemPrompt,
      tools: [computerTool({ computer: this.computer })],
      modelSettings: { truncation: 'auto' }
    });

    const input = this.formatTask(task);
    this.memory.addUserMessage(input);
    const result = await run(agent, input);
    const output = result.finalOutput ?? '';
    this.memory.addAssistantMessage(output);
    return output;
  }
}
