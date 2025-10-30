/**
 * Simple logger utility
 * Can be replaced with Winston or Pino later
 */

enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

const colors = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m', // Yellow
  INFO: '\x1b[36m', // Cyan
  DEBUG: '\x1b[35m', // Magenta
  RESET: '\x1b[0m',
};

const log = (level: LogLevel, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const color = colors[level];
  const reset = colors.RESET;

  console.log(`${color}[${timestamp}] [${level}]${reset} ${message}`);

  if (data) {
    console.log(data);
  }
};

export const logger = {
  error: (message: string, data?: any) => log(LogLevel.ERROR, message, data),
  warn: (message: string, data?: any) => log(LogLevel.WARN, message, data),
  info: (message: string, data?: any) => log(LogLevel.INFO, message, data),
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      log(LogLevel.DEBUG, message, data);
    }
  },
};
