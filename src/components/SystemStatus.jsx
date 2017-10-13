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
              <span className={ props.sai.tub.off === true ? 'error-color' : 'success-color' }>
                {
                  props.sai.tub.off !== -1
                  ?
                    props.sai.tub.off === false ? 'Active' : 'Inactive'
                  :
                    'Loading...'
                }
              </span>
            </div>
            <div>
              <strong title="Amount of collateral pool ETH claimed by 1 SKR">SKR/ETH</strong>
              {
                props.sai.tub.per.gte(0)
                ?
                  printNumber(props.sai.tub.per)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Price of 1 ETH in USD (as determined by the median of the feeds)">ETH/USD</strong>
              {
                props.sai.pip.val.gte(0)
                ?
                  printNumber(props.sai.pip.val)
                :
                  props.sai.pip.val.eq(-2)
                  ?
                    <span style={ {color: 'red'} }>Invalid Feed</span>
                  :
                    <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Target price for 1 SAI in USD">SAI/USD</strong>
              {
                props.sai.vox.par.gte(0)
                ?
                  printNumber(props.sai.vox.par)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Collateralization ratio below which a CDP may be liquidated">Liq. Ratio</strong>
              {
                props.sai.tub.mat.gte(0)
                ?
                  <span>{ printNumber(props.sai.tub.mat.times(100)) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Penalty charged by the system upon liquidation, as a percentage of the CDP collateral">Liq. Penalty</strong>
              {
                props.sai.tub.axe.gte(0)
                ?
                  <span>{ printNumber(props.sai.tub.axe.times(100).minus(web3.toWei(100))) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Maximum number of SAI that can be issued">Debt Ceiling</strong>
              {
                props.sai.tub.hat.gte(0)
                ?
                  printNumber(props.sai.tub.hat)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Discount/premium for converting between ETH and SKR via join and exit; the profits are accrued to the SKR collateral pool">Spread (Join/Exit)</strong>
              {
                props.sai.tub.gap.gte(0)
                ?
                  <span>{ printNumber(props.sai.tub.gap.times(100).minus(WAD.times(100))) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Discount/premium relative to Sai target price at which the system buys/sells collateral SKR for SAI. When negative, collateral is being sold at a discount (under ‘bust’) and bought at a premium (under ‘boom’)">Spread (Bust/Boom)</strong>
              {
                props.sai.tap.gap.gte(0)
                ?
                  <span>{ printNumber(props.sai.tap.gap.times(100).minus(WAD.times(100))) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong>System Collateralization</strong>
              <span>
                {
                  props.sai.gem.tubBalance.gte(0) && props.sai.pip.val.gte(0) && props.sai.sai.totalSupply.gte(0) && props.sai.vox.par.gte(0)
                  ?
                    <span>
                      {
                        printNumber(
                          props.sai.sai.totalSupply.eq(0)
                          ? 0
                          : wdiv(wmul(props.sai.gem.tubBalance, props.sai.pip.val), wmul(props.sai.sai.totalSupply, props.sai.vox.par)).times(100)
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
              <strong title="Whether the system is at less than 100% overall collateralisation">Deficit</strong>
              <span>{ props.sai.tub.off === false ? (props.sai.tub.eek !== 'undefined' ? (props.sai.tub.eek ? 'YES' : 'NO') : 'Loading...') : '-' }</span>
            </div>
            <div>
              <strong title="Whether the overall collateralization of the system is above the liquidation ratio">Safe</strong>
              <span>{ props.sai.tub.off === false ? (props.sai.tub.safe !== 'undefined' ? (props.sai.tub.safe ? 'YES' : 'NO') : 'Loading...') : '-' }</span>
            </div>
            <div>
              <strong title="CDP interest rate">CDP Fee (365 days)</strong>
              <span>
                {
                  props.sai.tub.tax.gte(0)
                  ?
                    <span>{ printNumber(web3.toWei(web3.fromWei(props.sai.tub.tax).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                  :
                    <span>Loading...</span>
                }
              </span>
            </div>
            <div>
              <strong title="Annual % change of Sai target price in USD. This represents Sai deflation or inflation when positive or negative, respectively">SAI Target Rate (365 days)</strong>
              <span>
                {
                  props.sai.vox.way.gte(0)
                  ?
                    <span>{ printNumber(web3.toWei(web3.fromWei(props.sai.vox.way).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                  :
                    <span>Loading...</span>
                }
              </span>
            </div>
            <div>
              <strong>Total Liquidity Available via Bust and Boom</strong>
              <span className="boom-bust">
                {
                  props.sai.tub.off === -1
                  ?
                    'Loading...'
                  :
                    props.sai.tub.off === false
                    ?
                      props.sai.tub.avail_bust_skr.gte(0) && props.sai.tub.avail_bust_sai.gte(0)
                      ?
                        <span>
                          Sell { printNumber(props.sai.tub.avail_bust_sai) } SAI<br />
                          Buy { printNumber(props.sai.tub.avail_bust_skr) } SKR
                        </span>
                      :
                        'Loading...'
                    :
                      '-'
                }
              </span>
              <span className="boom-bust">
                {
                  props.sai.tub.off === -1
                  ?
                    'Loading...'
                  :
                    props.sai.tub.off === false
                    ?
                      props.sai.tub.avail_boom_skr.gte(0) && props.sai.tub.avail_boom_sai.gte(0)
                      ?
                        <span>
                          Sell { printNumber(props.sai.tub.avail_boom_skr) } SKR<br />
                          Buy { printNumber(props.sai.tub.avail_boom_sai) } SAI
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
