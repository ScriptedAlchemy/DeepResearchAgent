import fs from 'fs';

export enum LogLevel {
  OFF = -1,
  ERROR = 0,
  INFO = 1,
  DEBUG = 2,
}

export class AgentLogger {
  private level: LogLevel = LogLevel.INFO;
  private stream: fs.WriteStream | null = null;

  initLogger(logPath: string, level: LogLevel = LogLevel.INFO) {
    this.level = level;
    this.stream = fs.createWriteStream(logPath, { flags: 'a' });
  }

  private write(prefix: string, msg: string) {
    const line = `${prefix}${msg}`;
    console.log(line);
    this.stream?.write(line + '\n');
  }

  info(msg: string) {
    if (this.level >= LogLevel.INFO) {
      this.write('', msg);
    }
  }

  warning(msg: string) {
    if (this.level >= LogLevel.INFO) {
      this.write('WARN: ', msg);
    }
  }

  error(msg: string) {
    if (this.level >= LogLevel.ERROR) {
      this.write('ERROR: ', msg);
    }
  }

  debug(msg: string) {
    if (this.level >= LogLevel.DEBUG) {
      this.write('DEBUG: ', msg);
    }
  }

  visualizeAgentTree(agent: unknown) {
    try {
      this.info(JSON.stringify(agent, null, 2));
    } catch {
      this.info(String(agent));
    }
  }
}

export const logger = new AgentLogger();
