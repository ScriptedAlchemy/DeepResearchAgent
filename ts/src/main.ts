import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import path from 'path';
import { config } from './config.js';
import { logger } from './logger.js';
import { BrowserComputer } from './computer.js';
import { GeneralAgent } from './agent/generalAgent.js';

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('config', {
      type: 'string',
      default: path.resolve('ts/configs/config_main.json'),
      describe: 'Path to config file',
    })
    .parse();

  config.initConfig(argv.config);
  logger.initLogger(config.logPath);

  const computer = await new BrowserComputer().init();
  try {
    const agent = new GeneralAgent(
      { name: config.agentName, model: config.model, templatePath: config.templatePath },
      computer
    );
    const task = "Use deep_researcher_agent to search the latest papers on the topic of 'AI Agent' and then summarize it.";
    const res = await agent.run(task);
    logger.info(`Result: ${res}`);
  } finally {
    await computer.dispose();
  }
}

main().catch(err => {
  console.error('Run failed:', err);
  process.exit(1);
});
