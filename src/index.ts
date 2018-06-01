import * as program from "commander";
import { join } from "path";
const packAge = require("../package.json");

program
  .version(packAge.version)
  .command("build <projectPath>")
  .option("-d, --debug")
  .option("-t, --tsconfigName <tsconfigName>")
  .description("rewirte tsc function")
  .action((projectPath, opt) => {
    let tsconfigPath = join(projectPath, opt.tsconfigName);
    console.log("tsconfigPath", tsconfigPath);
    console.log("debug", opt.debug);
  });
program.parse(process.argv);
