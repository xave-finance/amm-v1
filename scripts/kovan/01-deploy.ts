require("dotenv").config();
import { ethers } from "hardhat";
import { Signer } from "ethers";

import { CurveFactory } from "../../typechain/CurveFactory";
import { Router } from "../../typechain/Router";

async function main() {
  const [_deployer, _user1] = await ethers.getSigners();
  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await _deployer.getAddress()}`);
  console.log(`Deployer balance: ${await _deployer.getBalance()}`);
  console.log(`User1 account: ${await _user1.getAddress()}`);
  console.log(`User1 balance: ${await _user1.getBalance()}`);

  const CurvesLib = await ethers.getContractFactory("Curves");
  const OrchestratorLib = await ethers.getContractFactory("Orchestrator");
  const ProportionalLiquidityLib = await ethers.getContractFactory("ProportionalLiquidity");
  const SwapsLib = await ethers.getContractFactory("Swaps");
  const ViewLiquidityLib = await ethers.getContractFactory("ViewLiquidity");

  const curvesLib = await CurvesLib.deploy();
  const orchestratorLib = await OrchestratorLib.deploy();
  const proportionalLiquidityLib = await ProportionalLiquidityLib.deploy();
  const swapsLib = await SwapsLib.deploy();
  const viewLiquidityLib = await ViewLiquidityLib.deploy();

  const UsdcToUsdAssimilator = await ethers.getContractFactory("UsdcToUsdAssimilator");
  const EursToUsdAssimilator = await ethers.getContractFactory("EursToUsdAssimilator");
  // const CadcToUsdAssimilator = await ethers.getContractFactory("CadcToUsdAssimilator");
  // const XsgdToUsdAssimilator = await ethers.getContractFactory("XsgdToUsdAssimilator");

  const usdcToUsdAssimilator = await UsdcToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const eursToUsdAssimilator = await EursToUsdAssimilator.deploy({ gasLimit: 12000000 });
  // const cadcToUsdAssimilator = await CadcToUsdAssimilator.deploy({ gasLimit: 12000000 });
  // const xsgdToUsdAssimilator = await XsgdToUsdAssimilator.deploy({ gasLimit: 12000000 });

  const CurveFactory = await ethers.getContractFactory("CurveFactory", {
    libraries: {
      Curves: curvesLib.address,
      Orchestrator: orchestratorLib.address,
      ProportionalLiquidity: proportionalLiquidityLib.address,
      Swaps: swapsLib.address,
      ViewLiquidity: viewLiquidityLib.address,
    },
  });

  const RouterFactory = await ethers.getContractFactory("Router");
  const curveFactory = (await CurveFactory.deploy({ gasLimit: 12000000 })) as CurveFactory;
  const router = (await RouterFactory.deploy(curveFactory.address, { gasLimit: 12000000 })) as Router;

  console.log(`CONTRACT_CURVES_ADDR=${curvesLib.address}`);
  console.log(`CONTRACT_ORCHESTRATOR_ADDR=${orchestratorLib.address}`);
  console.log(`CONTRACT_PROPORTIONAL_LIQUIDITY_ADDR=${proportionalLiquidityLib.address}`);
  console.log(`CONTRACT_SWAPS_ADDR=${swapsLib.address}`);
  console.log(`CONTRACT_VIEW_LIQUIDITY_ADDR=${viewLiquidityLib.address}`);
  console.log(`CONTRACT_USDCTOUSDASSIMILATOR_ADDR=${usdcToUsdAssimilator.address}`);
  console.log(`CONTRACT_EURSTOUSDASSIMILATOR_ADDR=${eursToUsdAssimilator.address}`);
  // console.log(`CONTRACT_CADCTOUSDASSIMILATOR_ADDR=${cadcToUsdAssimilator.address}`)
  // console.log(`CONTRACT_XSGDTOUSDASSIMILATOR_ADDR=${xsgdToUsdAssimilator.address}`)
  console.log(`CONTRACT_CURVE_FACTORY_ADDR=${curveFactory.address}`);
  console.log(`CONTRACT_ROUTER_ADDR=${router.address}`);
  console.log(`Deployer balance: ${await _deployer.getBalance()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
