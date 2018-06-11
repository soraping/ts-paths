import { readJson, existsSync, stat, emptyDir } from "fs-extra";

/**
 * 是否为单文件
 * @param path
 */
export async function isFile(path: string): Promise<boolean> {
  if (existsSync(path)) {
    let fsStat = await stat(path);
    return fsStat.isFile();
  }
  return false;
}

/**
 * 是否为文件夹
 * @param path
 */
export async function isDirectory(path: string): Promise<boolean> {
  if (existsSync(path)) {
    let fsStat = await stat(path);
    return fsStat.isDirectory();
  }
  return false;
}

/**
 * json文件转称json格式
 * @param path
 * @param fields
 */
export async function filesToJson(
  path: string,
  fields?: string[]
): Promise<object> {
  let filesJSON = await readJson(path);
  return fieldsJson(filesJSON, fields);
}

/**
 * 递归返回路径json数据
 * @param data
 * @param fields
 */
const fieldsJson = (data: object, fields: string[]): Promise<object> => {
  let overData = data;
  const compose = i => {
    if (i == fields.length) {
      return;
    }
    if (overData[fields[i]]) {
      overData = overData[fields[i]];
    }
    compose(i + 1);
  };
  compose(0);
  return new Promise((resolve, reject) => {
    resolve(overData);
  });
};
