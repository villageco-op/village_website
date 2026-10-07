type LogFn = (message: string, ...args: unknown[]) => void;

interface Logger {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  debug: LogFn;
}

const isTest = process.env.IS_VITEST;
const isDev = process.env.NODE_ENV === 'development';

export const logger: Logger = {
  info: (msg, ...args) => {
    if (isTest) return;
    if (isDev) {
      console.info(`[INFO] ${msg}`, ...args);
    }
  },

  warn: (msg, ...args) => {
    if (isTest) return;
    console.warn(`[WARN] ${msg}`, ...args);
  },

  error: (msg, ...args) => {
    if (isTest) return;
    console.error(`[ERROR] ${msg}`, ...args);
  },

  debug: (msg, ...args) => {
    if (isTest) return;
    if (isDev) {
      console.debug(`[DEBUG] ${msg}`, ...args);
    }
  },
};
