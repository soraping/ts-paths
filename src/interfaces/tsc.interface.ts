export interface ITsc {
  // 编译文件目录
  projectPath?: string;
  // tsconfig.json文件（项目编译文件目录）
  tsconfigName?: string;
  // 工作根目录
  rootDir?: string;
}

export interface ICompilerOptions {
  rootDir: string;
  baseUrl: string;
  paths: object;
  outDir: string;
}
