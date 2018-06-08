import { resolve, join } from "path";
import { IBase, ITsc } from "./interfaces";
import { Logger } from "./logger";
import { Value, Autowired } from "./decorator";
import { isFile, isDirectory, filesToJson } from "./utils";

export class TscCmd {
  @Autowired() private logger: Logger;
  @Value("tsconfig.json") private _tsconfigName: string;
  @Value("./") private _projectPath: string;
  constructor(props: IBase) {
    this.logger.debug = props.debug;
  }

  async build(opt: ITsc = {}) {
    const tsconfigName = opt.tsconfigName || this._tsconfigName;
    const projectPath = resolve(
      process.cwd(),
      opt.projectPath || this._projectPath
    );
    // tsconfig文件路径
    const tsconfigPath = join(projectPath, tsconfigName);
    let isTsFile = await isFile(tsconfigPath);
    if (!isTsFile) {
      return this.logger.error("tsconfigName 必须是个单文件");
    }
    let isProject = await isDirectory(projectPath);
    if (!isProject) {
      return this.logger.error("projectPath 必须是一个文件夹");
    }
    this.logger.info(`编译文件夹相对路径 => ${projectPath}`);
    this.logger.info(`tsconfig.json 文件路径 => ${tsconfigPath}`);

    // 获取tsconfig中编译配置
    let compilerOptions = await filesToJson(tsconfigPath, ["compilerOptions"]);
    let baseUrl = compilerOptions["baseUrl"];
    let pathsJson = compilerOptions["paths"];
    // 获取paths映射表
    let pathsConfig = this._queryPathsConfig(baseUrl, pathsJson);
    console.log(pathsConfig);
    // 输出目录
    let outDir = compilerOptions["outDir"];
    // 扫输出目录，根据映射表替换文件
  }

  /**
   * 整理paths映射object
   * @param baseUrl
   * @param pathsJson
   */
  private _queryPathsConfig(baseUrl: string, pathsJson: object): object {
    let pathsConfig = {};
    Object.keys(pathsJson).forEach(key => {
      pathsConfig[key] = join(baseUrl, pathsJson[key][0]);
    });
    return pathsConfig;
  }

  /**
   * 扫输出目录，根据映射表替换文件
   */
  private async _transformPaths(): Promise<void> {}
}
