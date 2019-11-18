import React from 'react';
import web3 from '../web3';
import { printNumber, wdiv } from '../helpers';

const settings = require('../settings');

const renderCupActions = (feedValue, account, off, lock, cupId, cup, handleOpenModal) => {
  const actions = {
    lock: {
            active: account && cup.lad === account && off === false && lock,
            helper: 'Add collateral to a CDP'
          },
    free: {
            active: feedValue.gt(0) && account && cup.lad === account && cup.ink.gt(0) && cup.safe && (off === false || cup.art.eq(0)),
            helper: 'Remove collateral from a CDP'
          },
    draw: {
            active: feedValue.gt(0) && account && off === false && cup.lad === account && cup.ink.gt(0) && cup.safe,
            helper: 'Create Sai against a CDP'
          },
    wipe: {
            active: account && cup.lad === account && off === false && cup.art.gt(0),
            helper: 'Use Sai to cancel CDP debt'
          },
    give: {
            active: feedValue.gt(0) && account && off === false && cup.lad === account,
            helper: 'Transfer CDP ownership'
          },
    bite: {
            active: feedValue.gt(0) && account && ((off === true && cup.art.gt(0)) || cup.safe === false),
            helper: 'Initiate liquidation of an undercollateralized CDP'
          },
  };

  return (
    <span>
      {
        Object.keys(actions).map(key =>
          <span key={ key } style={ {textTransform: 'capitalize'} }>
            { actions[key].active
                ? <a href="#action" data-method={ key } data-cup={ cupId } onClick={ handleOpenModal } title={ actions[key].helper }>{ key }</a>
                : <span title={ actions[key].helper }>{ key }</span> }
            { Object.keys(actions).pop() !== key ? <span> / </span> : '' }
          </span>
        )
      }
    </span>
  )
}

const Cups = (props) => {
  return (
    <div className="box">
      <div className="box-header with-border cupsTabs">
        <a href="#action" data-value="mine" onClick={ props.listCups } className={ props.system.tub.cupsList === 'mine' ? 'selected' : '' }>My CDPs</a>
        <a href="#action" data-value="open" onClick={ props.listCups } className={ props.system.tub.cupsList === 'open' ? 'selected' : '' }>Open CDPs</a>
        <a href="#action" data-value="unsafe" onClick={ props.listCups } className={ props.system.tub.cupsList === 'unsafe' ? 'selected' : '' }>Unsafe CDPs</a>
        <a href="#action" data-value="closed" onClick={ props.listCups } className={ props.system.tub.cupsList === 'closed' ? 'selected' : '' }>Closed CDPs</a>
        <a href="#action" data-value="all" onClick={ props.listCups } className={ props.system.tub.cupsList === 'all' ? 'selected' : '' }>All CDPs</a>
      </div>
      <div className="box-body" id="cups">
        <div className="row">
          <div className="col-md-12">
            <div>
              <table className="text-right">
                <thead>
                  <tr>
                    <th className="text-right">CDP Id</th>
                    <th className="text-right" title="Amount of outstanding SAI debt in a CDP">Stability Debt (SAI)</th>
                    <th className="text-right" title="">Governance Debt (MKR)</th>
                    <th className="text-right" title="Amount of PETH collateral in a CDP">Locked (PETH)</th>
                    <th className="text-right" title="Ratio of collateral PETH to total outstanding PETH">% Tot (PETH)</th>
                    <th className="text-right" title="Collateral ratio of the CDP">% Ratio</th>
                    <th className="text-right" title="Maximum SAI that can currently be drawn from a CDP">Avail. SAI (to draw)</th>
                    <th className="text-right" title="Maximum PETH that can currently be released from a CDP">Avail. PETH (to free)</th>
                    <th className="text-right" title="ETH price at which a CDP will become unsafe and at risk of liquidation">Liquidation Price</th>
                    <th className="text-right" title="Whether the CDP is safe, unsafe (vulnerable to liquidation), or closed">Status</th>
                    {
                      settings.chain[props.network].service
                      ?<th>History</th>
                      :<th></th>
                    }
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    props.system.tub.cupsLoading
                    ?
                      <tr>
                        <td colSpan="11" className="cupsMessage">Loading CDPs...</td>
                      </tr>
                    :
                      Object.keys(props.system.tub.cups).length === 0
                      ?
                        <tr>
                          <td colSpan="11" className="cupsMessage">No existing CDPs for this filter...</td>
                        </tr>
                      :
                        Object.keys(props.system.tub.cups).map(key =>
                          <tr key={ key }>
                            <td>
                              { key }
                            </td>
                            <td>
                              { printNumber(props.tab(props.system.tub.cups[key])) }
                            </td>
                            <td>
                              {
                                props.system.pep.val.gte(0)
                                ? printNumber(wdiv(props.rap(props.system.tub.cups[key]), props.system.pep.val))
                                : 'Loading...'
                              }
                            </td>
                            <td>
                              { printNumber(props.system.tub.cups[key].ink) }
                            </td>
                            <td>
                              {
                                props.system.skr.totalSupply.gte(0)
                                  ? props.system.skr.totalSupply.gt(0)
                                    ? <span>{ printNumber(wdiv(props.system.tub.cups[key].ink, props.system.skr.totalSupply).times(100)) }%</span>
                                    : <span title="0">0.000%</span>
                                  : 'Loading...'
                              }
                            </td>
                            <td className={ props.system.tub.off === false && props.system.tub.cups[key].ratio && props.system.tub.cups[key].art.gt(web3.toBigNumber(0))
                                            ? (web3.toWei(props.system.tub.cups[key].ratio).lte(props.system.tub.mat.times(1.1))
                                              ? 'error-color'
                                              : (web3.toWei(props.system.tub.cups[key].ratio).lte(props.system.tub.mat.times(1.5)) ? 'warning-color' : 'success-color'))
                                            : '' }>
                              {
                                props.system.tub.off === false
                                  ? props.system.tub.cups[key].art.gt(web3.toBigNumber(0)) && props.system.tub.cups[key].pro
                                    ? <span>
                                        { printNumber(web3.toWei(props.system.tub.cups[key].ratio).times(100)) }%
                                      </span>
                                    : '-'
                                  : '-'
                              }
                            </td>
                            <td>
                              { props.system.tub.off === false ? printNumber(props.system.tub.cups[key].avail_dai) : '-' }
                            </td>
                            <td>
                              { props.system.tub.off === false ? printNumber(props.system.tub.cups[key].avail_skr) : '-' }
                            </td>
                            <td>
                              { props.system.tub.off === false && props.system.tub.cups[key].liq_price && props.system.tub.cups[key].liq_price.gt(0) ? printNumber(props.system.tub.cups[key].liq_price) : '-' }
                            </td>
                            <td className={ `text-center ${ props.system.tub.off === false ? (props.system.tub.cups[key].lad !== '0x0000000000000000000000000000000000000000' ? (props.system.tub.cups[key].safe && (props.system.tub.cups[key].art.eq(0) || props.system.tub.cups[key].ratio.gte(2)) ? 'success-color' : 'error-color') : 'warning-color') : '' }` }>
                              {
                                props.system.tub.off === false
                                ?
                                  props.system.tub.cups[key].lad === '0x0000000000000000000000000000000000000000'
                                  ?
                                    'Closed'
                                  :
                                    props.system.tub.cups[key].safe === 'N/A' || props.system.pip.val.lt(0)
                                    ?
                                      'N/A'
                                    :
                                      props.system.tub.cups[key].safe
                                      ?
                                        props.system.tub.cups[key].art.eq(0) || props.system.tub.cups[key].ratio.gte(2)
                                        ?
                                          'Safe'
                                        :
                                          'Risk'
                                      :
                                        'Unsafe'
                                :
                                  '-'
                              }
                            </td>
                            {
                              settings.chain[props.network].service
                              ?<td><a href="#action" data-id={ key } onClick={ props.handleOpenCupHistoryModal }>Show</a></td>
                              :<td></td>
                            }
                            <td className="text-left">
                              { renderCupActions(props.system.pip.val, props.profile, props.system.tub.off, props.system.skr.myBalance && props.system.skr.myBalance.gt(0), key, props.system.tub.cups[key], props.handleOpenModal) }
                            </td>
                          </tr>
                        )
                  }
                </tbody>
              </table>
            </div>
            {
              props.system.tub.cupsCount > 0 && !props.system.tub.cupsLoading &&
              <div className="paginator">
                {
                  props.system.tub.cupsPage > 1
                  ?
                    <a href="#action" onClick={ props.moveCupsPage } data-page="1">&lt; First</a>
                  :
                    <span>&lt; First</span>
                }
                &nbsp;-&nbsp;
                {
                  props.system.tub.cupsPage > 1
                  ?
                    <a href="#action" onClick={ props.moveCupsPage } data-page={ props.system.tub.cupsPage - 1 }>&lt; Prev</a>
                  :
                    <span>&lt; Prev</span>
                }
                &nbsp;-&nbsp;
                {
                  props.system.tub.cupsCount > props.system.tub.cupsPage * settings['CDPsPerPage']
                  ?
                    <a href="#action" onClick={ props.moveCupsPage } data-page={ props.system.tub.cupsPage + 1 }>Next &gt;</a>
                  :
                    <span>Next &gt;</span>
                }
                &nbsp;-&nbsp;
                {
                  props.system.tub.cupsCount > props.system.tub.cupsPage * settings['CDPsPerPage']
                  ?
                    <a href="#action" onClick={ props.moveCupsPage } data-page={ Math.ceil(props.system.tub.cupsCount / settings['CDPsPerPage']) }>Last &gt;</a>
                  :
                    <span>Last &gt;</span>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cups;
