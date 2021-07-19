const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.kovan') });

import { ethers } from "hardhat";
import { CurveFactory } from "../../typechain/CurveFactory";
import { Router } from "../../typechain/Router";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);

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

  // Core contracts addresses
  console.log(`CONTRACT_CORE_CURVES_ADDR=${curvesLib.address}`)
  console.log(`CONTRACT_CORE_ORCHESTRATOR_ADDR=${orchestratorLib.address}`)
  console.log(`CONTRACT_CORE_PROPORTIONAL_LIQUIDITY_ADDR=${proportionalLiquidityLib.address}`)
  console.log(`CONTRACT_CORE_SWAPS_ADDR=${swapsLib.address}`)
  console.log(`CONTRACT_CORE_VIEW_LIQUIDITY_ADDR=${viewLiquidityLib.address}`)
  console.log(`CONTRACT_CORE_CURVE_FACTORY_ADDR=${curveFactory.address}`)
  console.log(`CONTRACT_CORE_ROUTER_ADDR=${router.address}`)

  const AudToUsdAssimilator = await ethers.getContractFactory("AudToUsdAssimilator");
  const ChfToUsdAssimilator = await ethers.getContractFactory("ChfToUsdAssimilator");
  const EursToUsdAssimilator = await ethers.getContractFactory("EursToUsdAssimilator");
  const GbpToUsdAssimilator = await ethers.getContractFactory("GbpToUsdAssimilator");
  const JpyToUsdAssimilator = await ethers.getContractFactory("JpyToUsdAssimilator");
  const KrwToUsdAssimilator = await ethers.getContractFactory("KrwToUsdAssimilator");
  const PkrToUsdAssimilator = await ethers.getContractFactory("PkrToUsdAssimilator");
  const UsdcToUsdAssimilator = await ethers.getContractFactory("UsdcToUsdAssimilator");

  const audToUsdAssimilator = await AudToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const chfToUsdAssimilator = await ChfToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const eursToUsdAssimilator = await EursToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const gbpToUsdAssimilator = await GbpToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const jpyToUsdAssimilator = await JpyToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const krwToUsdAssimilator = await KrwToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const pkrToUsdAssimilator = await PkrToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const usdcToUsdAssimilator = await UsdcToUsdAssimilator.deploy({ gasLimit: 12000000 });

  // Assimilator contracts addresses
  console.log(`CONTRACT_ASSIMILATOR_AUDTOUSD_ADDR=${audToUsdAssimilator.address}`);
  console.log(`CONTRACT_ASSIMILATOR_CHFTOUSD_ADDR=${chfToUsdAssimilator.address}`);
  console.log(`CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR=${eursToUsdAssimilator.address}`);
  console.log(`CONTRACT_ASSIMILATOR_GBPTOUSD_ADDR=${gbpToUsdAssimilator.address}`);
  console.log(`CONTRACT_ASSIMILATOR_JPYTOUSD_ADDR=${jpyToUsdAssimilator.address}`);
  console.log(`CONTRACT_ASSIMILATOR_KRWTOUSD_ADDR=${krwToUsdAssimilator.address}`);
  console.log(`CONTRACT_ASSIMILATOR_PKRTOUSD_ADDR=${pkrToUsdAssimilator.address}`);
  console.log(`CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR=${usdcToUsdAssimilator.address}`);

  console.log(`Deployer balance: ${await deployer.getBalance()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
