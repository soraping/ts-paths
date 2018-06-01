import { ITsc } from "./interfaces";
import { Logger } from "./logger";
import { Value, Autowired } from "./decorator";
export class TscCmd {
  @Autowired() private logger: Logger;
  @Value("tsconfig.json") private _tsconfigName: string;
  @Value("./") private _projectPath: string;
  constructor(props: ITsc) {
    this.logger.debug = props.debug;
    this._tsconfigName = props.tsconfigName || this._tsconfigName;
    this._projectPath = props.projectPath || this._projectPath;
  }
}
