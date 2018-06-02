export interface ILogger {
  info(message: string);
  error(message: string, trace: string);
  warn(message: string);
}
