import hre from "hardhat";

const path = require('path');
const factoryUrl = path.resolve(__dirname, `./${hre.network.name}/factory_deployed.json`);
const factory = require(factoryUrl);
const assimilatorsUrl = path.resolve(__dirname, `./${hre.network.name}/assimilators_deployed.json`);
const assimilators = require(assimilatorsUrl);

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
