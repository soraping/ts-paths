import { join } from "path";
import * as program from "commander";
import { TscCmd } from "./tscCmd";
const packAge = require("../package.json");

program
  .version(packAge.version)
  .command("build <projectPath>")
  .option("-d, --debug")
  .option("-t, --tsconfigName <tsconfigName>")
  .description("rewirte tsc function")
  .action((projectPath, opt) => {
    new TscCmd({
      debug: opt.d,
      tsconfigName: opt.t,
      projectPath
    });
  });
program.parse(process.argv);
