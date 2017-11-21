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
              <span className={ props.dai.tub.off === true ? 'error-color' : 'success-color' }>
                {
                  props.dai.tub.off !== -1
                  ?
                    props.dai.tub.off === false ? 'Active' : 'Inactive'
                  :
                    'Loading...'
                }
              </span>
            </div>
            <div>
              <strong title="Amount of collateral pool ETH claimed by 1 SKR">SKR/ETH</strong>
              {
                props.dai.tub.per.gte(0)
                ?
                  printNumber(props.dai.tub.per)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Price of 1 ETH in USD (as determined by the median of the feeds)">ETH/USD</strong>
              {
                props.dai.pip.val.gte(0)
                ?
                  printNumber(props.dai.pip.val)
                :
                  props.dai.pip.val.eq(-2)
                  ?
                    <span style={ {color: 'red'} }>Invalid Feed</span>
                  :
                    <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Price of 1 MKR in USD (as determined by the median of the feeds)">MKR/USD</strong>
              {
                props.dai.pep.val.gte(0)
                ?
                  printNumber(props.dai.pep.val)
                :
                  props.dai.pep.val.eq(-2)
                  ?
                    <span style={ {color: 'red'} }>Invalid Feed</span>
                  :
                    <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Target price for 1 DAI in USD">DAI/USD</strong>
              {
                props.dai.vox.par.gte(0)
                ?
                  printNumber(props.dai.vox.par)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Collateralization ratio below which a CDP may be liquidated">Liq. Ratio</strong>
              {
                props.dai.tub.mat.gte(0)
                ?
                  <span>{ printNumber(props.dai.tub.mat.times(100)) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Penalty charged by the system upon liquidation, as a percentage of the CDP collateral">Liq. Penalty</strong>
              {
                props.dai.tub.axe.gte(0)
                ?
                  <span>{ printNumber(props.dai.tub.axe.times(100).minus(web3.toWei(100))) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Maximum number of DAI that can be issued">Debt Ceiling</strong>
              {
                props.dai.tub.hat.gte(0)
                ?
                  printNumber(props.dai.tub.hat)
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Discount/premium for converting between ETH and SKR via join and exit; the profits are accrued to the SKR collateral pool">Spread (Join/Exit)</strong>
              {
                props.dai.tub.gap.gte(0)
                ?
                  <span>{ printNumber(props.dai.tub.gap.times(100).minus(WAD.times(100))) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong title="Discount/premium relative to Dai target price at which the system buys/sells collateral SKR for DAI. When negative, collateral is being sold at a discount (under ‘bust’) and bought at a premium (under ‘boom’)">Spread (Bust/Boom)</strong>
              {
                props.dai.tap.gap.gte(0)
                ?
                  <span>{ printNumber(props.dai.tap.gap.times(100).minus(WAD.times(100))) }%</span>
                :
                  <span>Loading...</span>
              }
            </div>
            <div>
              <strong>System Collateralization</strong>
              <span>
                {
                  props.dai.gem.tubBalance.gte(0) && props.dai.pip.val.gte(0) && props.dai.dai.totalSupply.gte(0) && props.dai.vox.par.gte(0)
                  ?
                    <span>
                      {
                        printNumber(
                          props.dai.dai.totalSupply.eq(0)
                          ? 0
                          : wdiv(wmul(props.dai.gem.tubBalance, props.dai.pip.val), wmul(props.dai.dai.totalSupply, props.dai.vox.par)).times(100)
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
              <span>{ props.dai.tub.off === false ? (props.dai.tub.eek !== 'undefined' ? (props.dai.tub.eek ? 'YES' : 'NO') : 'Loading...') : '-' }</span>
            </div>
            <div>
              <strong title="Whether the overall collateralization of the system is above the liquidation ratio">Safe</strong>
              <span>{ props.dai.tub.off === false ? (props.dai.tub.safe !== 'undefined' ? (props.dai.tub.safe ? 'YES' : 'NO') : 'Loading...') : '-' }</span>
            </div>
            <div>
              <strong title="CDP interest rate">Stability Fee (365 days)</strong>
              <span>
                {
                  props.dai.tub.tax.gte(0)
                  ?
                    <span>{ printNumber(web3.toWei(web3.fromWei(props.dai.tub.tax).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                  :
                    <span>Loading...</span>
                }
              </span>
            </div>
            <div>
              <strong title="">Governance Fee (365 days)</strong>
              <span>
                {
                  props.dai.tub.fee.gte(0)
                  ?
                    <span>{ printNumber(web3.toWei(web3.fromWei(props.dai.tub.fee).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                  :
                    <span>Loading...</span>
                }
              </span>
            </div>
            <div>
              <strong title="Annual % change of Dai target price in USD. This represents Dai deflation or inflation when positive or negative, respectively">DAI Target Rate (365 days)</strong>
              <span>
                {
                  props.dai.vox.way.gte(0)
                  ?
                    <span>{ printNumber(web3.toWei(web3.fromWei(props.dai.vox.way).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                  :
                    <span>Loading...</span>
                }
              </span>
            </div>
            <div>
              <strong>Total Liquidity Available via Bust and Boom</strong>
              <span className="boom-bust">
                {
                  props.dai.tub.off === -1
                  ?
                    'Loading...'
                  :
                    props.dai.tub.off === false
                    ?
                      props.dai.tub.avail_bust_skr.gte(0) && props.dai.tub.avail_bust_dai.gte(0)
                      ?
                        <span>
                          Sell { printNumber(props.dai.tub.avail_bust_dai) } DAI<br />
                          Buy { printNumber(props.dai.tub.avail_bust_skr) } SKR
                        </span>
                      :
                        'Loading...'
                    :
                      '-'
                }
              </span>
              <span className="boom-bust">
                {
                  props.dai.tub.off === -1
                  ?
                    'Loading...'
                  :
                    props.dai.tub.off === false
                    ?
                      props.dai.tub.avail_boom_skr.gte(0) && props.dai.tub.avail_boom_dai.gte(0)
                      ?
                        <span>
                          Sell { printNumber(props.dai.tub.avail_boom_skr) } SKR<br />
                          Buy { printNumber(props.dai.tub.avail_boom_dai) } DAI
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
