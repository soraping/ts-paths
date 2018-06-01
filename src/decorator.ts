import { Metadata } from "./metadata";

/**
 * 默认赋值
 * @param value
 */
export const Value = (value: string | any = "") => {
  return (target: any, propertyKey: string) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(
      target,
      propertyKey
    ) || {
      writable: true,
      configurable: true
    };
    descriptor.value = value;
    Reflect.defineProperty(
      (target && target.prototype) || target,
      propertyKey,
      descriptor
    );
  };
};

/**
 *
 * @param params 实例化参数
 */
export const Autowired = (params: any = ""): Function => {
  return (target: any, propertyKey: string) => {
    let typeClass = Metadata.getType(target, propertyKey);
    // 获取当前修饰属性
    const descriptor = Reflect.getOwnPropertyDescriptor(
      (target && target.prototype) || target,
      propertyKey
    ) || {
      writable: true,
      configurable: true
    };
    // 实例化修饰类
    descriptor.value = params ? new typeClass(params) : new typeClass();
    // 新写法，替换Reflect.defineProperty
    Reflect.defineProperty(
      (target && target.prototype) || target,
      propertyKey,
      descriptor
    );
  };
};
