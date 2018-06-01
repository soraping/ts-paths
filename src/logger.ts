import { ILogger } from "./interfaces";
export class Logger {
  /**
   * 是否开启debug
   */
  private _debug: boolean;

  set debug(debug: boolean) {
    this._debug = debug;
  }
}
