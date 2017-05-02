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

export function formatNumber(obj, decimals = false, isWei = true) {
  let object = typeof obj === 'object' ? obj : web3.toBigNumber(0);

  if (isWei) object = web3.fromWei(object);

  if (decimals) {
    const d = web3.toBigNumber(10).pow(decimals);
    object = object.mul(d).trunc().div(d).toFixed(decimals);
  } else {
    object = object.valueOf();
  }

  const parts = object.toString().split('.');
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? `.${parts[1]}` : '');
}

export function fromRaytoWad(x) {
  const y = web3.toBigNumber(x).div(web3.toBigNumber(10).pow(9))
  return y;
}
