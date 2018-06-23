import { resolve, join, relative, dirname, extname } from "path";
import * as shell from "shelljs";
import { readdirSync, readFileSync, writeFileSync } from "fs-extra";
import { IBase, ITsc, ICompilerOptions } from "./interfaces";
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
      opt.rootDir,
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
    this.logger.info(`编译文件夹绝对路径 => ${projectPath}`);
    this.logger.info(`tsconfig.json 文件路径 => ${tsconfigPath}`);

    // 获取tsconfig中编译配置
    let compilerOptions = await filesToJson<ICompilerOptions>(tsconfigPath, [
      "compilerOptions"
    ]);

    // 编译操作
    await this._buildTsc(tsconfigPath);

    // tsconfig文件所在的路径
    let tsconfigDir = dirname(tsconfigPath);
    let baseUrl = compilerOptions.baseUrl;
    let pathsJson = compilerOptions.paths;
    // 输出目录
    let outDir = compilerOptions.outDir;
    // 路径映射表
    let pathsConfig = this._queryPathsConfig(
      join(tsconfigDir, outDir, baseUrl),
      pathsJson
    );
    // ts配置文件中设置的根目录
    let targetRootDir = compilerOptions.rootDir;

    await this._transformPaths(
      join(tsconfigDir, targetRootDir),
      join(tsconfigDir, outDir),
      pathsConfig
    );
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
   * 编译文件
   * @param tsconfigPath
   */
  private async _buildTsc(tsconfigPath: string): Promise<void> {
    this.logger.info("开始编译文件");
    let cmd = `tsc --project ${tsconfigPath}`;
    this.logger.info(`exec: ${cmd}`);
    shell.exec(cmd);
    if (shell.error()) {
      this.logger.error("编译失败");
      process.exit(-1);
    }
  }

  /**
   * 扫输出目录，根据映射表替换文件
   * @param rootDir tsconfig文件指定的root目录
   * @param outDir 输出目录
   * @param pathsConfig 替换映射关系
   */
  private async _transformPaths(
    rootDir: string,
    outDir: string,
    pathsConfig: object
  ): Promise<void> {
    // console.log("pathsConfig", pathsConfig);
    this.logger.info("开始替换文件字符");
    this.logger.info(`ts配置文件指向目录 => ${rootDir}`);
    this.logger.info(`ts配置文件输出目录 => ${outDir}`);
    // 操作的后缀文件
    const includesExtname = [".ts", ".js"];
    // 递归扫描输出目录
    let foreachDir = targetPath => {
      let pa = readdirSync(targetPath);
      pa.forEach(async item => {
        let itemPath = join(targetPath, item);
        if (await isDirectory(itemPath)) {
          foreachDir(itemPath);
        } else {
          if (includesExtname.includes(extname(itemPath))) {
            this.logger.warn(`目标文件 => ${itemPath}`);
            let file = readFileSync(itemPath).toString();
            // 替换文件中的路径
            Object.keys(pathsConfig).forEach(targetPath => {
              if (file.indexOf(targetPath) != -1) {
                let relative_path = relative(itemPath, pathsConfig[targetPath]);
                this.logger.info(`targetPath => ${targetPath}`);
                this.logger.info(`relative_path => ${relative_path}`);
                file = file.replace(targetPath, relative_path);
              }
            });
            writeFileSync(itemPath, file);
          }
        }
      });
    };
    foreachDir(outDir);
  }
}
