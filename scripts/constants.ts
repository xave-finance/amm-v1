import { parseUnits } from "ethers/lib/utils";

// Token names
export const NAME = "DFX V1";
export const SYMBOL = "DFX-V1";

// Weights are always 50/50
// Pool must respect a 10/90 ratio
// i.e. value of one pair cannot exceed 90% of the pools value
// ALPHA - The maximum and minimum allocation for each reserve
export const ALPHA = parseUnits("0.8");
// BETA - Liquidity depth of the exchange; The higher the value, the flatter the curve at the reported oracle price
// Slippage (fees) will that will be introduced when one of the tokens's ratio:
// - exceeds 75% of the pool value
// - goes under 25% of the pool value
export const BETA = parseUnits("0.5");
// MAX - Slippage when exchange is not at the reported oracle price
export const MAX = parseUnits("0.15");
// EPSILON - Fixed fee
export const EPSILON = parseUnits("0.0005"); // 5 basis point
// LAMBDA - Dynamic fee captured when slippage occurs
export const LAMBDA = parseUnits("0.3");
