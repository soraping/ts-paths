import * as program from "commander";
import { TscCmd } from "./tscCmd";
const packAge = require("../package.json");

program
  .version(packAge.version)
  .command("build <projectPath>")
  .description("transform tsconfig.json paths")
  .option("-d, --debug")
  .option("-l, --level [level]")
  .option("-t, --tsconfigName [tsconfigName]")
  .action((projectPath, opt) => {
    new TscCmd({
      debug: opt.debug,
      level: opt.level
    }).build({
      tsconfigName: opt.tsconfigName,
      rootDir: process.cwd(),
      projectPath
    });
  });

program.parse(process.argv);
