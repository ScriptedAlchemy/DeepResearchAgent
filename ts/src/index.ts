import { Agent, computerTool, run } from '@openai/agents';
import { BrowserComputer } from './computer.js';
import { fileURLToPath } from 'url';

export { BrowserComputer } from './computer.js';
export { GeneralAgent } from './agent/generalAgent.js';
export { DeepResearcherAgent } from './agent/deepResearcherAgent.js';
export { AgentMemory } from './agent/memory.js';

/**
 * runQuery spins up a BrowserComputer, executes the model loop for the given
 * query, and returns the model's final output.
 */
export async function runQuery(query: string): Promise<string> {
  const computer = await new BrowserComputer().init();
  try {
    const agent = new Agent({
      name: 'AssistantBrowser',
      model: 'computer-use-preview',
      instructions: 'You are a helpful browsing agent that can use a web browser to find information.',
      tools: [computerTool({ computer })],
      modelSettings: { truncation: 'auto' }
    });
    const result = await run(agent, query);
    return result.finalOutput ?? '';
  } finally {
    await computer.dispose();
  }
}

// Allow running this module directly via `node dist/index.js`.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const query = process.argv.slice(2).join(' ') || "What's the weather in Tokyo today?";
  runQuery(query).then(ans => console.log('Final answer:', ans)).catch(err => {
    console.error('Agent failed:', err);
    process.exit(1);
  });
}

/*
If running a local browser is not desired, you can delegate browser control to
OpenAI's hosted computer-use tool by omitting the BrowserComputer and instead
configuring a hosted tool when creating the agent. This requires API access to
the hosted tool but avoids managing Playwright locally.
*/
