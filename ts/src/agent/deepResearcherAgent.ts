import { BrowserComputer } from '../computer.js';
import { GeneralAgent, GeneralAgentConfig } from './generalAgent.js';

export class DeepResearcherAgent extends GeneralAgent {
  constructor(cfg: GeneralAgentConfig, computer: BrowserComputer) {
    super(cfg, computer);
  }
}
