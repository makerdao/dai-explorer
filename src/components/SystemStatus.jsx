import React from 'react';
import web3 from  '../web3';

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
              <span>{ typeof props.sai.tub.off !== 'undefined' ? (props.sai.tub.off ? 'Off' : 'On') : 'Loading...' }</span>
            </div>
            <div>
              <strong>ETH/SKR</strong>
              <span>{ props.toNumber(props.sai.tub.per).toFixed(3) }</span>
            </div>
            <div>
              <strong>USD/ETH</strong>
              <span>{ props.toNumber(props.sai.tub.tag).toFixed(3) }</span>
            </div>
            <div>
              <strong>Liq. Ratio</strong>
              <span>{ props.toNumber(props.sai.tub.mat.times(100)).toFixed(3) }%</span>
            </div>
            <div>
              <strong>Liq. Penalty</strong>
              <span>{ props.toNumber(props.sai.tub.axe.times(100).minus(web3.toWei(100))).toFixed(3) }%</span>
            </div>
            <div>
              <strong>Debt Ceiling</strong>
              <span>{ props.toNumber(props.sai.tub.hat).toFixed(3) }</span>
            </div>
            <div>
              <strong>Deficit</strong>
              <span>{ props.sai.tub.off === false ? (props.sai.tub.eek ? 'YES' : 'NO') : '-' }</span>
            </div>
            <div>
              <strong>Safe</strong>
              <span>{ props.sai.tub.off === false ? (props.sai.tub.safe ? 'YES' : 'NO') : '-' }</span>
            </div>
            <div>
              <strong>Avail. Boom</strong>
              <span>
                {
                  props.sai.tub.off === false
                  ? <span>
                      Sell { props.toNumber(props.sai.tub.avail_boom_sai).toFixed(3) } SKR<br />
                      Buy { props.toNumber(props.sai.tub.avail_boom_skr).toFixed(3) } SAI
                    </span>
                  : '-'
                }
              </span>
            </div>
            <div>
              <strong>Avail. Bust</strong>
              <span>
                {
                  props.sai.tub.off === false
                  ? <span>
                      Sell { props.toNumber(props.sai.tub.avail_bust_sai).toFixed(3) } SAI<br />
                      Buy { props.toNumber(props.sai.tub.avail_bust_skr).toFixed(3) } SKR
                    </span>
                  : '-'
                }
              </span>
            </div>
            <div>
              <strong>Fix</strong>
              <span>{ props.sai.tub.off ? props.toNumber(props.sai.tub.fix).toFixed(3) : '-' }</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus;
