const BURN_IN_PARAMS = {
  zeros: [
    'CrimpOutSol',
    'CrimpInSol',
    'CrimpLeftProx',
    'CrimpRightProx',
    'HomeProx',
    'DownProx',
    'UpSol',
    'DecoilerScalperProx',
  ],
  burnIn: 'BurnIn',
  time: /\bTime\b/g,
  targetWindow: /\bTargetWindow\b/g,
}

module.exports = BURN_IN_PARAMS