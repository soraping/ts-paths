# re-tsc

对 tsc 命令做了一些扩展

tsconfig.json 中 paths 参数对文件路径做了映射，但是编译时并没有把路径替换，所以在此命令中做了处理

> 使用

```bash
yarn add --dev re-tsc

npx re-tsc build . -p tsconfig.dev.json -d
```

> 参数解释

* `build <path>`

工作目录，处理待编译路径，默认 `./`

* -p

tsconfig.json 文件路径，相对于 build 的路径， 默认 `./tsconfig.json`

* -d

是否启用 debug，模式，控制台打印日志文件，默认 false

> tsc.ignore 文件

类似.gitignore 文件，添加忽略文件
