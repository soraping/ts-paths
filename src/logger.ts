import chalk from "chalk";
import { Value } from "./decorator";
import { ILogger } from "./interfaces";

enum LevelMap {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

/**
 * 简易日志记录
 */
export class Logger implements ILogger {
  /**
   * 是否开启debug
   */
  private _debug: boolean;

  /**
   * 显示等级
   */
  private _level: number;

  set debug(debug: boolean) {
    this._debug = debug;
  }

  set level(level: number) {
    this._level = level;
  }

  info(message: string) {
    this._print(message, chalk.green, LevelMap.INFO);
  }

  warn(message: string) {
    this._print(message, chalk.yellow, LevelMap.WARN);
  }

  error(message: string) {
    this._print(message, chalk.red, LevelMap.ERROR);
  }

  /**
   * 打印方法
   * @param msg
   * @param color
   */
  private _print(
    message: string,
    color: (msg: string) => string,
    level: number
  ) {
    if (!(this._debug && this._level >= level)) return;
    process.stdout.write(color(`[ts-paths] - `));
    process.stdout.write(color(`${new Date(Date.now()).toLocaleString()}   `));
    process.stdout.write(color(message));
    process.stdout.write(`\n`);
  }
}
