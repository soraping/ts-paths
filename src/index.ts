import { join } from "path";
import * as program from "commander";
import { TscCmd } from "./tscCmd";
const packAge = require("../package.json");

program
  .version(packAge.version)
  .command("build <projectPath>")
  .description("rewirte tsc function")
  .option("-d, --debug")
  .option("-t, --tsconfigName [tsconfigName]")
  .action((projectPath, opt) => {
    new TscCmd({
      debug: opt.debug
    }).build({
      tsconfigName: opt.tsconfigName,
      projectPath
    });
  });

program.parse(process.argv);
