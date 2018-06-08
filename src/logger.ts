import chalk from "chalk";
import { ILogger } from "./interfaces";
/**
 * 简易日志记录
 */
export class Logger implements ILogger {
  /**
   * 是否开启debug
   */
  private _debug: boolean;

  set debug(debug: boolean) {
    this._debug = debug;
  }

  info(message: string) {
    this._print(message, chalk.green);
  }

  warn(message: string) {
    this._print(message, chalk.yellow);
  }

  error(message: string) {
    this._print(message, chalk.red);
  }

  /**
   * 打印方法
   * @param msg
   * @param color
   */
  private _print(message: string, color: (msg: string) => string) {
    if (!this._debug) return;
    process.stdout.write(color(`[ts-paths] - `));
    process.stdout.write(color(`${new Date(Date.now()).toLocaleString()}   `));
    process.stdout.write(color(message));
    process.stdout.write(`\n`);
  }
}
