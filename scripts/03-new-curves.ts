import { curveHelper } from "./Utils";

const ASSIMILATOR_PAIRS = process.env.ASSIMILATOR_PAIRS;

async function main() {
  console.time('Deployment Time');
  const curves = ASSIMILATOR_PAIRS.indexOf(",") > -1 ? ASSIMILATOR_PAIRS.split(",") : [ASSIMILATOR_PAIRS];

  try {
    await curveHelper(curves);
  } catch (error) {
    console.log(`Error: ${error}`);
  }

  console.timeEnd('Deployment Time');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });