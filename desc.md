### 在node中使用ts的compilerOptions.paths的简单姿势

> 使用typescript开发node项目时，为了提高开发体验，经常会配置paths映射模块路径

``` javascript
{
	...
	"baseUrl": ".",
    "paths": {
      "@core": ["src/core"],
      "@interfaces": ["src/interfaces"],
      "@decorators": ["src/decorators"],
      "@constants": ["src/constants"],
      "@common": ["src/common"],
      "@services": ["src/services"],
      "@utils": ["src/utils"]
    }
}
```

在使用中就可以直接引入相应的模块，十分方便

![操作](http://ww1.sinaimg.cn/large/e221b779gy1fsn94yi9sjj20xw0bqab7.jpg)

方便归方便，但是ts只是做了一层映射关系，在编译阶段没有将代码替换，编译后的js代码中依然会存在 

![js](http://ww1.sinaimg.cn/large/e221b779gy1fsn994x7s9j20wg07ggno.jpg)

在启动时会抛出如下异常

``` bash
can not find XXX module
```

由于改变编译后的js代码会导致sourceMap会失效，但是经过调试发现只要不改变行数，sourceMap依然会能获取正确的代码位置，所以我打算在tsc编译后，通过扫输出目录，再根据映射关系，替换其中字符,
这样即能正确运行，又能正确的deubg。

> 使用commander制作命令行工具

思路比较简单，先通过tsc编译源码，然后再通过fs操作编译后的文件替换相应的字符


``` javascript

// 定义了三个参数

program
  .version(packAge.version)
  // 编译的目标目录
  .command("build <projectPath>")
  .description("transform tsconfig.json paths")
  // 查看日志
  .option("-d, --debug")
  // 指定tsconfig.json文件路径
  .option("-t, --tsconfigName [tsconfigName]")
  .action((projectPath, opt) => {
    // 具体操作
  });

```

``` javacript

// 第一步： 将tsconfig.json文件输出称json数据
let compilerOptions = await filesToJson<ICompilerOptions>(tsconfigPath, [
  "compilerOptions"
]);

// 第二步： 编译操作
await this._buildTsc(tsconfigPath);

// 第三步： 替换编译后文件夹中的相应字符
await this._transformPaths(
  join(tsconfigDir, targetRootDir),
  join(tsconfigDir, outDir),
  pathsConfig
);

```

> 最后，提交npm包，之后在项目中就可以愉快的玩耍了

``` bash

yarn add --dev ts-paths

npx ts-paths build ./ -t tsconfig.json -d

```

项目地址: https://github.com/soraping/ts-paths
