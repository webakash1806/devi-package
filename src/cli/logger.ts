import chalk from "chalk";

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  VERBOSE = 3,
  DEBUG = 4,
}

class Logger {
  private level: LogLevel = LogLevel.INFO;

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  error(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.ERROR) {
      console.error(chalk.red(`❌ ${message}`), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.WARN) {
      console.warn(chalk.yellow(`⚠️  ${message}`), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.INFO) {
      console.log(chalk.blue(message), ...args);
    }
  }

  success(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.INFO) {
      console.log(chalk.green(message), ...args);
    }
  }

  verbose(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.VERBOSE) {
      console.log(chalk.gray(`📝 ${message}`), ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.DEBUG) {
      console.log(chalk.magenta(`🔍 [DEBUG] ${message}`), ...args);
    }
  }
}

export const logger = new Logger();
