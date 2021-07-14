import { ethers } from "hardhat";
import { Curve } from "../typechain/Curve";
import { ERC20 } from "../typechain/ERC20";

export const createCurve = async function ({
  curveFactory,
  base,
  quote,
}: {
  curveFactory: Curve;
  base: string;
  quote: string;
}): Promise<{ curve: Curve; curveLpToken: ERC20 }> {
  const curveAddress = await curveFactory.curves(
    ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [base, quote])),
  );
  console.log("CurveFactory#curves Address: ", curveAddress);
  const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
  const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

  return {
    curve,
    curveLpToken,
  };
};

export const createCurveAndSetParams = async function ({
  curveFactory,
  base,
  quote,
}: {
  curveFactory: Curve;

  base: string;
  quote: string;
}) {
  const { curve, curveLpToken } = await createCurve({
    curveFactory,
    base,
    quote,
  });

  return {
    curve,
    curveLpToken,
  };
};

export const multiApproval = async (requests: [string, string][], erc20: ERC20) => {
  for (let i = 0; i < requests.length; i++) {
    await erc20.attach(requests[i][0]).approve(requests[i][1], ethers.constants.MaxUint256);
  }
};
