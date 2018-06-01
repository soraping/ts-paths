import { IBase } from "./base.interface";
export interface ITsc extends IBase {
  // 编译文件目录
  projectPath?: string;
  // tsconfig.json文件（项目编译文件目录）
  tsconfigName?: string;
}
