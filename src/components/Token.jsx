import React from 'react';
import AnimatedNumber from '../AnimatedNumber';
import { formatNumber, copyToClipboard, etherscanToken } from '../helpers';

const Token = (props) => {
  const token = props.sai[props.token];
  // const totalSupply = props.token === 'sai' || props.token === 'sin' ? token.totalSupply.add(props.sai.sin.issuerFee) : token.totalSupply;
  // const tapBalance = props.token === 'sai' ? token.tapBalance.add(props.sai.sin.issuerFee) : token.tapBalance;
  // const tubBalance = props.token === 'sin' ? token.tubBalance.add(props.sai.sin.issuerFee) : token.tubBalance;
  const totalSupply = token.totalSupply;
  const tapBalance = token.tapBalance;
  const tubBalance = token.tubBalance;
  const tubBalanceLabel = props.token === 'gem' ? 'Total Pooled' : 'Total Locked';
  const tubBalanceDesc = props.token === 'gem' ? 'Amount of ETH in the SKR collateral pool' : 'Amount of SKR locked as collateral in CDPs';
  const tapBalanceLabel = props.token === 'gem' ? 'Redeemable' : (props.token === 'skr' ? 'Pending Sale' : (props.token === 'sai' ? 'Pending Sale' : 'Tap Balance'));
  const tapBalanceDesc = props.token === 'gem'
                          ? 'Amount of ETH available to cash for SAI'
                          : (props.token === 'skr'
                            ? 'Amount of SKR collateral pending liquidation via bust'
                            : (props.token === 'sai'
                              ? 'Amount of surplus SAI pending sale via boom'
                              : ''));
  return (
    <div className="col-md-4 col-sm-4 col-xs-12">
      <div className="info-box">
        <span className={`info-box-icon ${props.color}`}>
          { etherscanToken(props.network, props.token === 'gem' ? 'WETH' : props.token, token.address) }
        </span>
        <div className="info-box-content">
          {
            token.myBalance
            ?
              <span className="info-box-number">
                <span style={ { textDecoration: 'underline' } }>{ etherscanToken(props.network, 'Your Balance', token.address, props.account) }</span>
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
          <span className="info-box-number">
            <span>{ etherscanToken(props.network, 'Total Supply', token.address) }</span>
            <AnimatedNumber
              value={ totalSupply }
              title={ formatNumber(totalSupply, 18) }
              formatValue={ n => formatNumber(n, 3) }
              className="printedNumber"
              onClick = { copyToClipboard } />
          </span>
          {
            token.tubBalance
            ?
              <span className="info-box-number">
                <span title={ tubBalanceDesc }>{ etherscanToken(props.network, tubBalanceLabel, token.address, props.sai.tub.address) }</span>
                <AnimatedNumber
                  value={ tubBalance }
                  title={ formatNumber(tubBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          {
            token.tapBalance && (props.token !== 'gem' || props.off === true)
            ?
              <span className="info-box-number">
                <span title={ tapBalanceDesc }>{ etherscanToken(props.network, tapBalanceLabel, token.address, props.sai.tap.address) }</span>
                <AnimatedNumber
                  value={ tapBalance }
                  title={ formatNumber(tapBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
        </div>
      </div>
    </div>
  )
}

export default Token;
