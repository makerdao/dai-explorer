import React from 'react';
import web3 from  '../web3';
import { formatNumber } from '../helpers';

const Lpc = (props) => {
  const lpcActions = {
    pool: props.isUser() && (props.state.sai.gem.myBalance.gt(0) || props.state.sai.sai.myBalance.gt(0)),
    exit: props.isUser() && props.state.sai.lps.myBalance && props.state.sai.lps.myBalance.gt(0),
    take: props.isUser() && (props.state.sai.gem.myBalance.gt(0) || props.state.sai.sai.myBalance.gt(0)),
  };
  return (
    <div className="box">
      <div className="box-header with-border">
        <h3 className="box-title">LPC Actions</h3>
      </div>
      <div className="box-body">
        <div className="row">
          <div className="col-md-12">
            {
              Object.keys(lpcActions).map(key =>
                <span key={ key }>
                  { lpcActions[key] ? <a href="#action" data-method={ `lpc-${key}` } onClick={ props.handleOpenModal }>{ key }</a> : key }
                  <span> / </span>
                </span>
              )
            }
            <div className="system-status">
              <div>
                <strong>SAI/LPS</strong>
                {
                  props.state.sai.lpc.per
                  ?
                    <span title={ formatNumber(web3.toBigNumber(10).pow(36).div(props.state.sai.lpc.per)) }>
                      { formatNumber(web3.toBigNumber(10).pow(36).div(props.state.sai.lpc.per), 3) }
                    </span>
                  :
                    <span>Loading...</span>
                }
              </div>
              <div>
                <strong>ETH/LPS</strong>
                {
                  props.state.sai.lpc.per
                  ?
                    <span title={ formatNumber(web3.toBigNumber(10).pow(54).div(props.state.sai.tub.tag).div(props.state.sai.lpc.per)) }>
                      { formatNumber(web3.toBigNumber(10).pow(54).div(props.state.sai.tub.tag).div(props.state.sai.lpc.per), 3) }
                    </span>
                  :
                    <span>Loading...</span>
                }
              </div>
              <div>
                <strong>Funds worth in SAI</strong>
                {
                  props.state.sai.lpc.pie
                  ?
                    <span title={ formatNumber(props.state.sai.lpc.pie) }>
                      { formatNumber(props.state.sai.lpc.pie, 3) }
                    </span>
                  :
                    <span>Loading...</span>
                }
              </div>
              <div>
                <strong>Funds worth in ETH</strong>
                {
                  props.state.sai.lpc.pie
                  ?
                    <span title={ formatNumber(props.state.sai.lpc.pie.times(web3.toBigNumber(10).pow(18)).div(props.state.sai.tub.tag)) }>
                      { formatNumber(props.state.sai.lpc.pie.times(web3.toBigNumber(10).pow(18)).div(props.state.sai.tub.tag), 3) }
                    </span>
                  :
                    <span>Loading...</span>
                }
              </div>
              <div>
                <strong>Tax</strong>
                {
                  props.state.sai.lpc.gap
                  ?
                    <span title={ formatNumber(props.state.sai.lpc.gap.times(100).minus(web3.toBigNumber(10).pow(20))) }>
                      { formatNumber(props.state.sai.lpc.gap.times(100).minus(web3.toBigNumber(10).pow(20)), 3) }%
                    </span>
                  :
                    <span>Loading...</span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lpc;
