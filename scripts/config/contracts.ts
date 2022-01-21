import hre from "hardhat";
const path = require("path");
const factoryUrl = path.resolve(__dirname, `./${hre.network.name}/factory_deployed.json`);
const factory = require(factoryUrl);

export const CONTRACTS = {
  curves: factory.libraries.Curves,
  orchestrator: factory.libraries.Orchestrator,
  proportionalLiquidity: factory.libraries.ProportionalLiquidity,
  swaps: factory.libraries.Swaps,
  viewLiquidity: factory.libraries.ViewLiquidity,
  factory: factory.curveFactory,
  router: factory.router,
  zap: factory.zap,
};
