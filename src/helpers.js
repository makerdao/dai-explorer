import web3 from './web3';

var padLeft = function (string, chars, sign) {
  return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
};

export function toBytes32(x) {
  let y = web3.toHex(web3.toWei(x));
  y = y.replace('0x', '');
  y = padLeft(y, 64);
  y = '0x' + y;
  return y;
}
window.toBytes32 = toBytes32;
