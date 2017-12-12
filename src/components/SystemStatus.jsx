import React, { Component } from 'react';
import web3 from  '../web3';
import { WAD, printNumber, wdiv, wmul } from '../helpers';

class SystemStatus extends Component {
  state = {
    viewMore: false
  };

  saveStorage = (e) => {
    localStorage.setItem('statusCollapsed', localStorage.getItem('statusCollapsed') === "true" ? false : true)
  }

  viewMore = (e) => {
    e.preventDefault();
    this.setState({ viewMore: true });
  }

  hide = (e) => {
    e.preventDefault();
    this.setState({ viewMore: false });
  }

  render = () => {
    return (
      <div className="box collapsed">
        <div className="box-header with-border" data-toggle="collapse" data-parent="#accordion" href="#collapseStatus" onClick={ this.saveStorage } aria-expanded={ localStorage.getItem('statusCollapsed') !== 'true' }>
          <h3 className="box-title">System Status</h3>
        </div>
        <div id="collapseStatus" className={ `box-body panel-collapse collapse${localStorage.getItem('statusCollapsed') !== 'true' ? ' in' : ''}` } aria-expanded={ localStorage.getItem('statusCollapsed') !== 'true' } style={{ height: localStorage.getItem('statusCollapsed') !== 'true' ? "auto" : "0px" }}>
          <div className="row">
            <div className="col-md-12 system-status">
              <div className="main">
                <div>
                  <strong>Status</strong>
                  <span className={ this.props.system.tub.off === true ? 'error-color' : 'success-color' }>
                    {
                      this.props.system.tub.off !== -1
                      ?
                        this.props.system.tub.off === false ? 'Active' : 'Inactive'
                      :
                        'Loading...'
                    }
                  </span>
                </div>
                <div>
                  <strong>System Collateralization</strong>
                  <span>
                    {
                      this.props.system.gem.tubBalance.gte(0) && this.props.system.pip.val.gte(0) && this.props.system.dai.totalSupply.gte(0) && this.props.system.vox.par.gte(0)
                      ?
                        <span>
                          {
                            printNumber(
                              this.props.system.dai.totalSupply.eq(0)
                              ? 0
                              : wdiv(wmul(this.props.system.gem.tubBalance, this.props.system.pip.val), wmul(this.props.system.dai.totalSupply, this.props.system.vox.par)).times(100)
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
                  <strong title="Percentage number of maximum DAI already issued">Debt Ceiling Ratio</strong>
                  {
                    this.props.system.dai.totalSupply.gte(0) && this.props.system.tub.cap.gte(0)
                    ?
                      <span>{ this.props.system.dai.totalSupply.eq(0) ? printNumber(0) : printNumber(wdiv(this.props.system.dai.totalSupply, this.props.system.tub.cap).times(100)) }%</span>
                    :
                      <span>Loading...</span>
                  }
                </div>
                <div>
                  <strong title="Amount of collateral pool ETH claimed by 1 PETH">PETH/ETH</strong>
                  {
                    this.props.system.tub.per.gte(0)
                    ?
                      printNumber(this.props.system.tub.per)
                    :
                      <span>Loading...</span>
                  }
                </div>
                <div>
                  <strong>Total Liquidity Available</strong>
                  <span className="boom-bust">
                    {
                      this.props.system.tub.off === -1
                      ?
                        'Loading...'
                      :
                        this.props.system.tub.off === false
                        ?
                          this.props.system.tub.avail_bust_skr.gte(0) && this.props.system.tub.avail_bust_dai.gte(0)
                          ?
                            <span>
                              Sell { printNumber(this.props.system.tub.avail_bust_dai) } DAI<br />
                              Buy { printNumber(this.props.system.tub.avail_bust_skr) } PETH
                            </span>
                          :
                            'Loading...'
                        :
                          '-'
                    }
                  </span>
                  <span className="boom-bust">
                    {
                      this.props.system.tub.off === -1
                      ?
                        'Loading...'
                      :
                        this.props.system.tub.off === false
                        ?
                          this.props.system.tub.avail_boom_skr.gte(0) && this.props.system.tub.avail_boom_dai.gte(0)
                          ?
                            <span>
                              Sell { printNumber(this.props.system.tub.avail_boom_skr) } PETH<br />
                              Buy { printNumber(this.props.system.tub.avail_boom_dai) } DAI
                            </span>
                          :
                            'Loading...'
                        :
                          '-'
                    }
                  </span>
                  <div style={ {marginLeft: '8px'} }>
                    {
                      Object.keys(this.props.actions).map(key =>
                        this.props.actions[key].active
                        ? <a key={ key } className="buttonAction" href="#action" data-method={ key } onClick={ this.props.handleOpenModal } ><span data-method={ key }>{ this.props.actions[key].display }</span></a>
                        : <span key={ key } className="buttonAction" ><span>{ this.props.actions[key].display }</span></span>
                      )
                    }
                  </div>
                </div>
              </div>
              <div className="more" style={ {display: this.state.viewMore ? 'block' : 'none'} }>
                <div>
                  <strong title="Price of 1 ETH in USD (as determined by the median of the feeds)">ETH/USD</strong>
                  {
                    this.props.system.pip.val.gte(0)
                    ?
                      printNumber(this.props.system.pip.val)
                    :
                      this.props.system.pip.val.eq(-2)
                      ?
                        <span style={ {color: 'red'} }>Invalid Feed</span>
                      :
                        <span>Loading...</span>
                  }
                </div>
                <div>
                  <strong title="Price of 1 MKR in USD (as determined by the median of the feeds)">MKR/USD</strong>
                  {
                    this.props.system.pep.val.gte(0)
                    ?
                      printNumber(this.props.system.pep.val)
                    :
                      this.props.system.pep.val.eq(-2)
                      ?
                        <span style={ {color: 'red'} }>Invalid Feed</span>
                      :
                        <span>Loading...</span>
                  }
                </div>
                <div>
                  <strong title="Target price for 1 DAI in USD">DAI/USD</strong>
                  {
                    this.props.system.vox.par.gte(0)
                    ?
                      printNumber(this.props.system.vox.par)
                    :
                      <span>Loading...</span>
                  }
                </div>
                <div>
                  <strong title="Collateralization ratio below which a CDP may be liquidated">Liq. Ratio</strong>
                  {
                    this.props.system.tub.mat.gte(0)
                    ?
                      <span>{ printNumber(this.props.system.tub.mat.times(100)) }%</span>
                    :
                      <span>Loading...</span>
                  }
                </div>
                <div>
                  <strong title="Penalty charged by the system upon liquidation, as a percentage of the CDP collateral">Liq. Penalty</strong>
                  {
                    this.props.system.tub.axe.gte(0)
                    ?
                      <span>{ printNumber(this.props.system.tub.axe.times(100).minus(web3.toWei(100))) }%</span>
                    :
                      <span>Loading...</span>
                  }
                </div>
                <div>
                  <strong title="Maximum number of DAI that can be issued">Debt Ceiling</strong>
                  {
                    this.props.system.tub.cap.gte(0)
                    ?
                      printNumber(this.props.system.tub.cap)
                    :
                      <span>Loading...</span>
                  }
                </div>
                <div>
                  <strong title="Discount/premium for converting between ETH and PETH via join and exit; the profits are accrued to the PETH collateral pool">Spread (Join/Exit)</strong>
                  {
                    this.props.system.tub.gap.gte(0)
                    ?
                      <span>{ printNumber(this.props.system.tub.gap.times(100).minus(WAD.times(100))) }%</span>
                    :
                      <span>Loading...</span>
                  }
                </div>
                <div>
                  <strong title="Discount/premium relative to Dai target price at which the system buys/sells collateral PETH for DAI. When negative, collateral is being sold at a discount (under ‘bust’) and bought at a premium (under ‘boom’)">Spread (Bust/Boom)</strong>
                  {
                    this.props.system.tap.gap.gte(0)
                    ?
                      <span>{ printNumber(this.props.system.tap.gap.times(100).minus(WAD.times(100))) }%</span>
                    :
                      <span>Loading...</span>
                  }
                </div>
                <div>
                  <strong>Total Bad Debt</strong>
                  <span>
                    {
                      this.props.system.sin.tapBalance.gte(0)
                      ?
                        printNumber(this.props.system.sin.tapBalance)
                      :
                        'Loading...'
                    }
                  </span>
                </div>
                <div>
                  <strong title="Whether the system is at less than 100% overall collateralisation">Deficit</strong>
                  <span>{ this.props.system.tub.off === false ? (this.props.system.tub.eek !== 'undefined' ? (this.props.system.tub.eek ? 'YES' : 'NO') : 'Loading...') : '-' }</span>
                </div>
                <div>
                  <strong title="Whether the overall collateralization of the system is above the liquidation ratio">Safe</strong>
                  <span>{ this.props.system.tub.off === false ? (this.props.system.tub.safe !== 'undefined' ? (this.props.system.tub.safe ? 'YES' : 'NO') : 'Loading...') : '-' }</span>
                </div>
                <div>
                  <strong title="CDP interest rate">Stability Fee (365 days)</strong>
                  <span>
                    {
                      this.props.system.tub.tax.gte(0)
                      ?
                        <span>{ printNumber(web3.toWei(web3.fromWei(this.props.system.tub.tax).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                      :
                        <span>Loading...</span>
                    }
                  </span>
                </div>
                <div>
                  <strong title="">Governance Fee (365 days)</strong>
                  <span>
                    {
                      this.props.system.tub.fee.gte(0)
                      ?
                        <span>{ printNumber(web3.toWei(web3.fromWei(this.props.system.tub.fee).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                      :
                        <span>Loading...</span>
                    }
                  </span>
                </div>
                <div>
                  <strong title="Annual % change of Dai target price in USD. This represents Dai deflation or inflation when positive or negative, respectively">DAI Target Rate (365 days)</strong>
                  <span>
                    {
                      this.props.system.vox.way.gte(0)
                      ?
                        <span>{ printNumber(web3.toWei(web3.fromWei(this.props.system.vox.way).pow(60 * 60 * 24 * 365)).times(100).minus(web3.toWei(100))) }%</span>
                      :
                        <span>Loading...</span>
                    }
                  </span>
                </div>
              </div>
              {
                this.state.viewMore
                ? <a className="more-link" href="#action" onClick={ this.hide }>Hide</a>
                : <a className="more-link" href="#action" onClick={ this.viewMore }>View More</a>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SystemStatus;
