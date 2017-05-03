import React from 'react';
import web3 from '../web3';
import AnimatedNumber from '../AnimatedNumber';
import { formatNumber } from '../helpers';

const Token = (props) => {
  return (
    <div className="col-md-3 col-sm-6 col-xs-12">
      <div className="info-box">
        <span className={`info-box-icon ${props.color}`}>
          {props.token}
        </span>
        <div className="info-box-content">
          <span className="info-box-number">
            <span>Total</span>
            <AnimatedNumber
              value={ props.sai[props.token].totalSupply }
              title={ formatNumber(props.sai[props.token].totalSupply) }
              formatValue={ n => formatNumber(n, 3) } />
          </span>
          <span className="info-box-number">
            <span>Mine</span>
            <AnimatedNumber
              value={ props.sai[props.token].myBalance }
              title={ formatNumber(props.sai[props.token].myBalance) }
              formatValue={ n => formatNumber(n, 3) } />
          </span>
          <span className="info-box-number">
            <span>Tub</span>
            <AnimatedNumber
              value={ props.sai[props.token].tubBalance }
              title={ formatNumber(props.sai[props.token].tubBalance) }
              formatValue={ n => formatNumber(n, 3) } />
          </span>
          <span className="info-box-number">
            <span>Pot</span>
            <AnimatedNumber
              value={ props.sai[props.token].potBalance }
              title={ formatNumber(props.sai[props.token].potBalance) }
              formatValue={ n => formatNumber(n, 3) } />
          </span>
        </div>
      </div>
    </div>
  )
}

export default Token;
