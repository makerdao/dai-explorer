import React from 'react';
import web3 from  '../web3';
import { printNumber } from '../helpers';

const Lpc = (props) => {
  const lpcActions = {
    pool: props.isUser() && (props.state.sai.gem.myBalance.gt(0) || props.state.sai.sai.myBalance.gt(0)),
    exit: props.isUser() && props.state.sai.lps.myBalance && props.state.sai.lps.myBalance.gt(0),
    take: props.isUser() && (props.state.sai.gem.myBalance.gt(0) || props.state.sai.sai.myBalance.gt(0)),
  };
  const maxClaimSai = props.state.sai.lps.myBalance && props.state.sai.lpc.per && props.state.sai.lpc.gap
                    ? props.state.sai.lps.myBalance.times(web3.toBigNumber(10).pow(36).div(props.state.sai.lpc.per).div(props.state.sai.lpc.gap))
                    : false;
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
              {/*<div>
                <strong>SAI/LPS</strong>
                {
                  props.state.sai.lpc.per
                  ?
                    printNumber(web3.toBigNumber(10).pow(36).div(props.state.sai.lpc.per))
                  :
                    <span>Loading...</span>
                }
              </div>
              <div>
                <strong>ETH/LPS</strong>
                {
                  props.state.sai.lpc.per
                  ?
                    printNumber(web3.toBigNumber(10).pow(54).div(props.state.sai.tub.tag).div(props.state.sai.lpc.per))
                  :
                    <span>Loading...</span>
                }
              </div>*/}
              <div>
                <strong>LPC Funds of SAI</strong>
                {
                  props.state.sai.lpc.pie
                  ?
                    printNumber(props.state.sai.sai.lpcBalance)
                  :
                    <span>Loading...</span>
                }
              </div>
              <div>
                <strong>LPC Funds of ETH</strong>
                {
                  props.state.sai.lpc.pie
                  ?
                    printNumber(props.state.sai.gem.lpcBalance)
                  :
                    <span>Loading...</span>
                }
              </div>
              <div>
                <strong>Avail. to exit (in SAI)</strong>
                {
                  maxClaimSai
                  ?
                    printNumber(maxClaimSai)
                  :
                    <span>Loading...</span>
                }
              </div>
              <div>
                <strong>Avail. to exit (in ETH)</strong>
                {
                  maxClaimSai && props.state.sai.tub.tag.gt(0)
                  ?
                    printNumber(maxClaimSai.times(web3.toBigNumber(10).pow(18)).div(props.state.sai.tub.tag))
                  :
                    <span>Loading...</span>
                }
              </div>
              {/*<div>
                <strong>Funds worth in SAI</strong>
                {
                  props.state.sai.lpc.pie
                  ?
                    printNumber(props.state.sai.lpc.pie)
                  :
                    <span>Loading...</span>
                }
              </div>
              <div>
                <strong>Funds worth in ETH</strong>
                {
                  props.state.sai.lpc.pie
                  ?
                    printNumber(props.state.sai.lpc.pie.times(web3.toBigNumber(10).pow(18)).div(props.state.sai.tub.tag))
                  :
                    <span>Loading...</span>
                }
              </div>*/}
              <div>
                <strong>Fee</strong>
                {
                  props.state.sai.lpc.gap
                  ?
                    printNumber(props.state.sai.lpc.gap.times(100).minus(web3.toBigNumber(10).pow(20)))
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
