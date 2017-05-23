import React from 'react';
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

export function toBytes12(x) {
  let y = web3.toHex(x);
  y = y.replace('0x', '');
  y = padLeft(y, 24);
  y = '0x' + y;
  return y;
}

export function formatNumber(number, decimals = false, isWei = true) {
  web3.BigNumber.config({ ROUNDING_MODE: 4 });

  let object = web3.toBigNumber(number);

  if (isWei) object = web3.fromWei(object.round(0));

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

export function copyToClipboard(e) {
  const value = e.target.title.replace(',', '');
  var aux = document.createElement("input");
  aux.setAttribute('value', value);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  alert(`Value: "${value}" copied to clipboard`);
}

export function printNumber(number) {
  return <span className="printedNumber" onClick={ copyToClipboard } title={ formatNumber(number, 18) }>{ formatNumber(number, 3) }</span>
}
