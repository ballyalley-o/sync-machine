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
  // burnIn: /\bBurnIn\b/g,
  burnIn: 'BurnIn',
  time: /\bTime\b/g,
  targetWindow: /\bTargetWindow\b/g,
  // targetWindow: 'TargetWindow',
  address: /\baddress\b/g,
  ipAddress: /^192.168.10.10$/g,
}

module.exports = BURN_IN_PARAMS