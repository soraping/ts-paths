import { resolve } from "path";
import { IBase, ITsc } from "./interfaces";
import { Logger } from "./logger";
import { Value, Autowired } from "./decorator";
export class TscCmd {
  @Autowired() private logger: Logger;
  @Value("tsconfig.json") private _tsconfigName: string;
  @Value("./") private _projectPath: string;
  constructor(props: IBase) {
    this.logger.debug = props.debug;
  }

  build(opt: ITsc = {}) {
    const tsconfigName = opt.tsconfigName || this._tsconfigName;
    const projectPath = opt.projectPath || this._projectPath;
    // tsconfig文件路径
    const tsconfigPath = resolve(projectPath, tsconfigName);
    this.logger.info(`编译文件夹相对路径 => ${projectPath}`);
    this.logger.info(`tsconfig.json 文件路径 => ${tsconfigPath}`);
  }
}
