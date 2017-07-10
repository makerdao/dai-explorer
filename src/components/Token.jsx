import React from 'react';
import AnimatedNumber from '../AnimatedNumber';
import { formatNumber, copyToClipboard, etherscanToken } from '../helpers';

const Token = (props) => {
  const token = props.sai[props.token];
  const totalSupply = props.token === 'sai' || props.token === 'sin' ? token.totalSupply.add(props.sai.sin.issuerFee) : token.totalSupply;
  const pitBalance = props.token === 'sai' ? token.pitBalance.add(props.sai.sin.issuerFee) : token.pitBalance;
  const potBalance = props.token === 'sin' ? token.potBalance.add(props.sai.sin.issuerFee) : token.potBalance;
  return (
    <div className="col-md-6 col-sm-6 col-xs-12">
      <div className={ props.sai.lpc.address ? 'info-box big' : 'info-box'}>
        <span className={`info-box-icon ${props.color}`}>
          { etherscanToken(props.network, props.token === 'gem' ? 'WETH' : props.token, token.address) }
        </span>
        <div className="info-box-content">
          {
            token.myBalance
            ?
              <span className="info-box-number">
                <span style={ { textDecoration: 'underline' } }>{ etherscanToken(props.network, 'Your balance', token.address, props.account) }</span>
                <AnimatedNumber
                  value={ token.myBalance }
                  title={ formatNumber(token.myBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          {
            token.jarBalance
            ?
              <span className="info-box-number">
                <span>{ etherscanToken(props.network, 'Jar balance', token.address, props.sai.jar.address) }</span>
                <AnimatedNumber
                  value={ token.jarBalance }
                  title={ formatNumber(token.jarBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          {
            token.potBalance
            ?
              <span className="info-box-number">
                <span>{ etherscanToken(props.network, 'Pot balance', token.address, props.sai.pot.address) }</span>
                <AnimatedNumber
                  value={ potBalance }
                  title={ formatNumber(potBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          {
            token.pitBalance
            ?
              <span className="info-box-number">
                <span>{ etherscanToken(props.network, 'Pit balance', token.address, props.sai.pit.address) }</span>
                <AnimatedNumber
                  value={ pitBalance }
                  title={ formatNumber(pitBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          {
            props.sai.lpc.address && token.lpcBalance
            ?
              <span className="info-box-number">
                <span>{ etherscanToken(props.network, 'Lpc balance', token.address, props.sai.lpc.address) }</span>
                <AnimatedNumber
                  value={ token.lpcBalance }
                  title={ formatNumber(token.lpcBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          <span className="info-box-number">
            <span>{ etherscanToken(props.network, 'Total Supply', token.address) }</span>
            <AnimatedNumber
              value={ totalSupply }
              title={ formatNumber(totalSupply, 18) }
              formatValue={ n => formatNumber(n, 3) }
              className="printedNumber"
              onClick = { copyToClipboard } />
          </span>
        </div>
      </div>
    </div>
  )
}

export default Token;
