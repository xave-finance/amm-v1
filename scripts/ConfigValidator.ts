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

export const validateCurveConfig = params => {
  const dimensionKeys = [
    'alpha',
    'beta',
    'max',
    'epsilon',
    'lambda'
  ];

  const paramsKeys = [
    'token_symbol',
    'token_name',
    'weights',
    'lpt_name',
    'dimensions'
  ];

  for (const paramKey of paramsKeys) {
    const extractedParamsKeys = Object.keys(params);
    if (!extractedParamsKeys.includes(paramKey)) return false;

    if (extractedParamsKeys.includes('dimensions') && paramKey === 'dimensions') {
      const extractedDimensionKeys = Object.keys(params.dimensions);
      for (const dimensionKey of dimensionKeys) {
        if (!extractedDimensionKeys.includes(dimensionKey)) return false;
      }
    }
  }

  return true;
}