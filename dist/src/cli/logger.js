import chalk from "chalk";
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["VERBOSE"] = 3] = "VERBOSE";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
})(LogLevel || (LogLevel = {}));
class Logger {
    constructor() {
        this.level = LogLevel.INFO;
    }
    setLevel(level) {
        this.level = level;
    }
    error(message, ...args) {
        if (this.level >= LogLevel.ERROR) {
            console.error(chalk.red(`❌ ${message}`), ...args);
        }
    }
    warn(message, ...args) {
        if (this.level >= LogLevel.WARN) {
            console.warn(chalk.yellow(`⚠️  ${message}`), ...args);
        }
    }
    info(message, ...args) {
        if (this.level >= LogLevel.INFO) {
            console.log(chalk.blue(message), ...args);
        }
    }
    success(message, ...args) {
        if (this.level >= LogLevel.INFO) {
            console.log(chalk.green(message), ...args);
        }
    }
    verbose(message, ...args) {
        if (this.level >= LogLevel.VERBOSE) {
            console.log(chalk.gray(`📝 ${message}`), ...args);
        }
    }
    debug(message, ...args) {
        if (this.level >= LogLevel.DEBUG) {
            console.log(chalk.magenta(`🔍 [DEBUG] ${message}`), ...args);
        }
    }
}
export const logger = new Logger();
