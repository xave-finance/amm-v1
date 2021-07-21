import * as factory from "./factory_deployed.json";
import * as assimilators from "./assimilators_deployed.json";

export const CONTRACTS = {
  factory: factory.curveFactory,
  curves: factory.libraries.Curves,
  orchestrator: factory.libraries.Orchestrator,
  swaps: factory.libraries.Swaps,
  viewLiquidity: factory.libraries.ViewLiquidity,
  cadcToUsdAssimilator: assimilators.cadcToUsdAssimilator,
  usdcToUsdAssimilator: assimilators.usdcToUsdAssimilator,
  eursToUsdAssimilator: assimilators.eursToUsdAssimilator,
  xsgdToUsdAssimilator: assimilators.xsgdToUsdAssimilator,
};
