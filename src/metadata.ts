import "reflect-metadata";

export const Metadata = {
  /**
   * 获取成员类型
   * @param target
   * @param propertyKey
   */
  getType: (target: any, propertyKey: string) => {
    return Reflect.getMetadata("design:type", target, propertyKey);
  }
};
