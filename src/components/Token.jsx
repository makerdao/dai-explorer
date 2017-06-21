import React from 'react';
import AnimatedNumber from '../AnimatedNumber';
import { formatNumber, copyToClipboard } from '../helpers';

const Token = (props) => {
  const totalSupply = props.token === 'sai' || props.token === 'sin' ? props.sai[props.token].totalSupply.add(props.sai.sin.issuerFee) : props.sai[props.token].totalSupply;
  const pitBalance = props.token === 'sai' ? props.sai[props.token].pitBalance.add(props.sai.sin.issuerFee) : props.sai[props.token].pitBalance;
  const potBalance = props.token === 'sin' ? props.sai[props.token].potBalance.add(props.sai.sin.issuerFee) : props.sai[props.token].potBalance;
  return (
    <div className="col-md-4 col-sm-6 col-xs-12">
      <div className="info-box">
        <span className={`info-box-icon ${props.color}`}>
          { props.token === 'gem' ? 'WETH' : props.token }
        </span>
        <div className="info-box-content">
          <span className="info-box-number">
            <span>Total</span>
            <AnimatedNumber
              value={ totalSupply }
              title={ formatNumber(totalSupply, 18) }
              formatValue={ n => formatNumber(n, 3) }
              className="printedNumber"
              onClick = { copyToClipboard } />
          </span>
          <span className="info-box-number">
            <span>Mine</span>
            <AnimatedNumber
              value={ props.sai[props.token].myBalance }
              title={ formatNumber(props.sai[props.token].myBalance, 18) }
              formatValue={ n => formatNumber(n, 3) }
              className="printedNumber"
              onClick = { copyToClipboard } />
          </span>
          {
            props.sai[props.token].potBalance
            ?
              <span className="info-box-number">
                <span>Pot</span>
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
            props.sai[props.token].pitBalance
            ?
              <span className="info-box-number">
                <span>Pit</span>
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
            props.sai[props.token].jarBalance
            ?
              <span className="info-box-number">
                <span>Jar</span>
                <AnimatedNumber
                  value={ props.sai[props.token].jarBalance }
                  title={ formatNumber(props.sai[props.token].jarBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          {
            props.sai[props.token].tapBalance
            ?
              <span className="info-box-number">
                <span>Tap</span>
                <AnimatedNumber
                  value={ props.sai[props.token].tapBalance }
                  title={ formatNumber(props.sai[props.token].tapBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          {
            props.sai[props.token].lpcBalance
            ?
              <span className="info-box-number">
                <span>Lpc</span>
                <AnimatedNumber
                  value={ props.sai[props.token].lpcBalance }
                  title={ formatNumber(props.sai[props.token].lpcBalance, 18) }
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
