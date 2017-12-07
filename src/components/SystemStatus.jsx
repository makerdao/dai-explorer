import React from 'react';
import web3 from  '../web3';
import { WAD, printNumber, wdiv, wmul } from '../helpers';

const saveStorage = (e) => {
  localStorage.setItem('statusCollapsed', localStorage.getItem('statusCollapsed') === "true" ? false : true)
}

const SystemStatus = (props) => {
  return (
    <div className="box collapsed">
      <div className="box-header with-border" data-toggle="collapse" data-parent="#accordion" href="#collapseStatus" onClick={ saveStorage } aria-expanded={ localStorage.getItem('statusCollapsed') !== 'true' }>
        <h3 className="box-title">System Status</h3>
      </div>
      <div id="collapseStatus" className={ `box-body panel-collapse collapse${localStorage.getItem('statusCollapsed') !== 'true' ? ' in' : ''}` } aria-expanded={ localStorage.getItem('statusCollapsed') !== 'true' } style={{ height: localStorage.getItem('statusCollapsed') !== 'true' ? "auto" : "0px" }}>
        <div className="row">
          <div className="col-md-12 system-status">
            <div>
              <strong>Status</strong>
              <span className={ props.system.tub.off === true ? 'error-color' : 'success-color' }>
                {
                  props.system.tub.off !== -1
                  ?
                    props.system.tub.off === false ? 'Active' : 'Inactive'
                  :
                    'Loading...'
                }
              </span>
            </div>
            <div>
              <strong title="Amount of collateral pool ETH claimed by 1 PETH">PETH/ETH</strong>
              {
                props.system.tub.per.gte(0)
                ?
                  printNumber(props.system.tub.per)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Price of 1 ETH in USD (as determined by the median of the feeds)">ETH/USD</strong>
              {
                props.system.pip.val.gte(0)
                ?
                  printNumber(props.system.pip.val)
                :
                  props.system.pip.val.eq(-2)
                  ?
                    <span style={ {color: 'red'} }>Invalid Feed</span>
                  :
                    <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Price of 1 MKR in USD (as determined by the median of the feeds)">MKR/USD</strong>
              {
                props.system.pep.val.gte(0)
                ?
                  printNumber(props.system.pep.val)
                :
                  props.system.pep.val.eq(-2)
                  ?
                    <span style={ {color: 'red'} }>Invalid Feed</span>
                  :
                    <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Target price for 1 DAI in USD">DAI/USD</strong>
              {
                props.system.vox.par.gte(0)
                ?
                  printNumber(props.system.vox.par)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Collateralization ratio below which a CDP may be liquidated">Liq. Ratio</strong>
              {
                props.system.tub.mat.gte(0)
                ?
                  <span>{ printNumber(props.system.tub.mat.times(100)) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Penalty charged by the system upon liquidation, as a percentage of the CDP collateral">Liq. Penalty</strong>
              {
                props.system.tub.axe.gte(0)
                ?
                  <span>{ printNumber(props.system.tub.axe.times(100).minus(web3.toWei(100))) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Maximum number of DAI that can be issued">Debt Ceiling</strong>
              {
                props.system.tub.cap.gte(0)
                ?
                  printNumber(props.system.tub.cap)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Discount/premium for converting between ETH and PETH via join and exit; the profits are accrued to the PETH collateral pool">Spread (Join/Exit)</strong>
              {
                props.system.tub.gap.gte(0)
                ?
                  <span>{ printNumber(props.system.tub.gap.times(100).minus(WAD.times(100))) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Discount/premium relative to Dai target price at which the system buys/sells collateral PETH for DAI. When negative, collateral is being sold at a discount (under ‘bust’) and bought at a premium (under ‘boom’)">Spread (Bust/Boom)</strong>
              {
                props.system.tap.gap.gte(0)
                ?
                  <span>{ printNumber(props.system.tap.gap.times(100).minus(WAD.times(100))) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong>System Collateralization</strong>
              <span>
                {
                  props.system.gem.tubBalance.gte(0) && props.system.pip.val.gte(0) && props.system.dai.totalSupply.gte(0) && props.system.vox.par.gte(0)
                  ?
                    <span>
                      {
                        printNumber(
                          props.system.dai.totalSupply.eq(0)
                          ? 0
                          : wdiv(wmul(props.system.gem.tubBalance, props.system.pip.val), wmul(props.system.dai.totalSupply, props.system.vox.par)).times(100)
                        )
                      }
                      %
                    </span>
                  :
                    'Loading...'
                }
              </span>
            </div>
            <div>
              <strong>Total Bad Debt</strong>
              <span>
                {
                  props.system.sin.tapBalance.gte(0)
                  ?
                    printNumber(props.system.sin.tapBalance)
                  :
                    'Loading...'
                }
              </span>
            </div>
            <div>
              <strong title="Whether the system is at less than 100% overall collateralisation">Deficit</strong>
              <span>{ props.system.tub.off === false ? (props.system.tub.eek !== 'undefined' ? (props.system.tub.eek ? 'YES' : 'NO') : 'Loading...') : '-' }</span>
            </div>
            <div>
              <strong title="Whether the overall collateralization of the system is above the liquidation ratio">Safe</strong>
              <span>{ props.system.tub.off === false ? (props.system.tub.safe !== 'undefined' ? (props.system.tub.safe ? 'YES' : 'NO') : 'Loading...') : '-' }</span>
            </div>
            <div>
              <strong title="CDP interest rate">Stability Fee (365 days)</strong>
              <span>
                {
                  props.system.tub.tax.gte(0)
                  ?
                    <span>{ printNumber(web3.toWei(web3.fromWei(props.system.tub.tax).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                  :
                    <span>Loading...</span>
                }
              </span>
            </div>
            <div>
              <strong title="">Governance Fee (365 days)</strong>
              <span>
                {
                  props.system.tub.fee.gte(0)
                  ?
                    <span>{ printNumber(web3.toWei(web3.fromWei(props.system.tub.fee).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                  :
                    <span>Loading...</span>
                }
              </span>
            </div>
            <div>
              <strong title="Annual % change of Dai target price in USD. This represents Dai deflation or inflation when positive or negative, respectively">DAI Target Rate (365 days)</strong>
              <span>
                {
                  props.system.vox.way.gte(0)
                  ?
                    <span>{ printNumber(web3.toWei(web3.fromWei(props.system.vox.way).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                  :
                    <span>Loading...</span>
                }
              </span>
            </div>
            <div>
              <strong>Total Liquidity Available via Bust and Boom</strong>
              <span className="boom-bust">
                {
                  props.system.tub.off === -1
                  ?
                    'Loading...'
                  :
                    props.system.tub.off === false
                    ?
                      props.system.tub.avail_bust_skr.gte(0) && props.system.tub.avail_bust_dai.gte(0)
                      ?
                        <span>
                          Sell { printNumber(props.system.tub.avail_bust_dai) } DAI<br />
                          Buy { printNumber(props.system.tub.avail_bust_skr) } PETH
                        </span>
                      :
                        'Loading...'
                    :
                      '-'
                }
              </span>
              <span className="boom-bust">
                {
                  props.system.tub.off === -1
                  ?
                    'Loading...'
                  :
                    props.system.tub.off === false
                    ?
                      props.system.tub.avail_boom_skr.gte(0) && props.system.tub.avail_boom_dai.gte(0)
                      ?
                        <span>
                          Sell { printNumber(props.system.tub.avail_boom_skr) } PETH<br />
                          Buy { printNumber(props.system.tub.avail_boom_dai) } DAI
                        </span>
                      :
                        'Loading...'
                    :
                      '-'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus;
