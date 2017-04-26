import web3 from './web3';

var padLeft = function (string, chars, sign) {
  return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
};

export function toBytes32(x) {
  let y = web3.toHex(x);
  y = y.replace('0x', '');
  y = padLeft(y, 64);
  y = '0x' + y;
  return y;
}

export function fromRaytoWad(x) {
  const y = web3.toBigNumber(x).div(web3.toBigNumber(10).pow(9))
  return y;
}
