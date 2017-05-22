import React from 'react';
import web3 from  '../web3';
import { printNumber } from '../helpers';

const SystemStatus = (props) => {
  return (
    <div className="box">
      <div className="box-header with-border">
        <h3 className="box-title">SAI Status</h3>
      </div>
      <div className="box-body">
        <div className="row">
          <div className="col-md-12 system-status">
            <div>
              <strong>Status</strong>
              <span className={ props.sai.tub.reg.gt(0) ? 'error-color' : 'success-color' }>
                {
                  typeof props.sai.tub.reg.lt(0)
                  ?
                    (props.sai.tub.reg.eq(0) ? 'Usual' : (props.sai.tub.reg.eq(1) ? 'Caged' : 'Empty'))
                  :
                    'Loading...'
                }
              </span>
            </div>
            <div>
              <strong>ETH/SKR</strong>
              {
                props.sai.tub.per.gt(0)
                ?
                  printNumber(props.sai.tub.per)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong>USD/ETH</strong>
              {
                props.sai.tub.tag.gt(0)
                ?
                  printNumber(props.sai.tub.tag)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong>Liq. Ratio</strong>
              {
                props.sai.tub.mat.gt(0)
                ?
                  <span>{ printNumber(props.sai.tub.mat.times(100)) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong>Liq. Penalty</strong>
              {
                props.sai.tub.axe.gt(0)
                ?
                  <span>{ printNumber(props.sai.tub.axe.times(100).minus(web3.toWei(100))) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong>Debt Ceiling</strong>
              {
                props.sai.tub.hat.gt(0)
                ?
                  printNumber(props.sai.tub.hat)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong>Deficit</strong>
              <span>{ props.sai.tub.reg.eq(0) ? (props.sai.tub.eek !== 'undefined' ? (props.sai.tub.eek ? 'YES' : 'NO') : 'Loading...') : '-' }</span>
            </div>
            <div>
              <strong>Safe</strong>
              <span>{ props.sai.tub.reg.eq(0) ? (props.sai.tub.safe !== 'undefined' ? (props.sai.tub.safe ? 'YES' : 'NO') : 'Loading...') : '-' }</span>
            </div>
            <div>
              <strong>Avail. Boom</strong>
              <span>
                {
                  props.sai.tub.reg.eq(0)
                  ? <span>
                      Sell { printNumber(props.sai.tub.avail_boom_skr) } SKR<br />
                      Buy { printNumber(props.sai.tub.avail_boom_sai) } SAI
                    </span>
                  : '-'
                }
              </span>
            </div>
            <div>
              <strong>Avail. Bust</strong>
              <span>
                {
                  props.sai.tub.reg.eq(0)
                  ? <span>
                      Sell { printNumber(props.sai.tub.avail_bust_sai) } SAI<br />
                      Buy { printNumber(props.sai.tub.avail_bust_skr) } SKR
                    </span>
                  : '-'
                }
              </span>
            </div>
            <div>
              <strong>Cage Price (USD/ETH)</strong>
              {
                props.sai.tub.reg.gt(0) && props.sai.tub.cage_price.gt(0)
                ?
                  printNumber(props.sai.tub.cage_price)
                :
                  <span>-</span>
              }
            </div>
            <div>
              <strong>Fix (ETH/USD)</strong>
              {
                props.sai.tub.reg.gt(0) && props.sai.tub.fix.gt(0)
                ?
                  printNumber(props.sai.tub.fix)
                :
                  <span>-</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus;
