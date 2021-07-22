// import { CONTRACTS } from "./contracts";

import * as factory from "./factory_deployed.json";
import * as assimilators from "./assimilators_deployed.json";

export const CONTRACTS = {
  curves: factory.libraries.Curves,
  orchestrator: factory.libraries.Orchestrator,
  proportionalLiquidity: factory.libraries.ProportionalLiquidity,
  swaps: factory.libraries.Swaps,
  viewLiquidity: factory.libraries.ViewLiquidity,
  factory: factory.curveFactory,
  router: factory.router,

  usdcToUsdAssimilator: assimilators.usdcToUsdAssimilator,
  eursToUsdAssimilator: assimilators.eursToUsdAssimilator
};
