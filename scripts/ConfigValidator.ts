export const validateAssimilatorConfig = config => {
  const assimilatorKeys = [
    'baseDecimals',
    'baseTokenAddress',
    'quoteTokenAddress',
    'oracleAddress'
  ];

  for (const key of assimilatorKeys) {
    const configKeys = Object.keys(config)
    if (!configKeys.includes(key)) return false;
  }

  return true;
}