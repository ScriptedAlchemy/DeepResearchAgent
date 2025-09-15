import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export class Config {
  logPath = 'dra.log';
  templatePath = '';
  model = 'computer-use-preview';
  agentName = 'DeepResearcher';

  initConfig(configPath: string) {
    const resolved = path.resolve(configPath);
    const raw = fs.readFileSync(resolved, 'utf-8');
    const cfg = JSON.parse(raw);
    const baseDir = path.dirname(resolved);
    if (cfg.log_path) {
      this.logPath = path.resolve(baseDir, cfg.log_path);
    }
    if (cfg.template_path) {
      this.templatePath = path.resolve(baseDir, cfg.template_path);
    }
    if (cfg.model) {
      this.model = cfg.model;
    }
    if (cfg.agent_name) {
      this.agentName = cfg.agent_name;
    }
  }
}

export const config = new Config();
