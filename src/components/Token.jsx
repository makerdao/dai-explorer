import React from 'react';
import AnimatedNumber from '../AnimatedNumber';
import { formatNumber, copyToClipboard } from '../helpers';

const Token = (props) => {
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
              value={ props.sai[props.token].totalSupply }
              title={ formatNumber(props.sai[props.token].totalSupply) }
              formatValue={ n => formatNumber(n, 3) }
              className="printedNumber"
              onClick = { copyToClipboard } />
          </span>
          <span className="info-box-number">
            <span>Mine</span>
            <AnimatedNumber
              value={ props.sai[props.token].myBalance }
              title={ formatNumber(props.sai[props.token].myBalance) }
              formatValue={ n => formatNumber(n, 3) }
              className="printedNumber"
              onClick = { copyToClipboard } />
          </span>
          {
            props.sai[props.token].tubBalance
            ?
              <span className="info-box-number">
                <span>Tub</span>
                <AnimatedNumber
                  value={ props.sai[props.token].tubBalance }
                  title={ formatNumber(props.sai[props.token].tubBalance) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          {
            props.sai[props.token].tubBalance
            ?
              <span className="info-box-number">
                <span>Pot</span>
                <AnimatedNumber
                  value={ props.sai[props.token].potBalance }
                  title={ formatNumber(props.sai[props.token].potBalance) }
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
                  title={ formatNumber(props.sai[props.token].lpcBalance) }
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
