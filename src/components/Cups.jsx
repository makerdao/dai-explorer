import React from 'react';
import web3 from '../web3';
import { printNumber, wdiv } from '../helpers';

const settings = require('../settings');

const renderCupActions = (feedValue, account, off, lock, cupId, cup, handleOpenModal, defaultAccount) => {
  const actions = {
    lock: feedValue.gt(0) && account && off === false && cup.lad === defaultAccount && lock,
    free: feedValue.gt(0) && account && cup.lad === defaultAccount && cup.ink.gt(0) && cup.safe,
    draw: feedValue.gt(0) && account && off === false && cup.lad === defaultAccount && cup.ink.gt(0) && cup.safe,
    wipe: feedValue.gt(0) && account && off === false && cup.lad === defaultAccount && cup.art.gt(0),
    shut: feedValue.gt(0) && account && off === false && cup.lad === defaultAccount,
    give: feedValue.gt(0) && account && off === false && cup.lad === defaultAccount,
    bite: feedValue.gt(0) && account && ((off === true && cup.art.gt(0)) || cup.safe === false),
  };

  const helpers = {
    lock: 'Add collateral to a CDP',
    free: 'Remove collateral from a CDP',
    draw: 'Create Sai against a CDP',
    wipe: 'Use Sai to cancel CDP debt',
    shut: 'Close a CDP - Wipe all debt, Free all collateral, and delete the CDP',
    give: 'Transfer CDP ownership',
    bite: 'Initiate liquidation of an undercollateralized CDP',
  };

  return (
    <span>
      {
        Object.keys(actions).map(key =>
          <span key={ key } style={ {textTransform: 'capitalize'} }>
            { actions[key] ? <a href="#action" data-method={ key } data-cup={ cupId } onClick={ handleOpenModal } title={ helpers[key] }>{ key }</a> : <span title={ helpers[key] }>{ key }</span> }
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
      <div className="box-header with-border">
        <h3 className="box-title">{ props.all ? 'All' : 'My' } CDPs - <a href={ props.all ? '#mine' : '#all' }>Show { props.all ? 'only my' : 'all' } CDPs</a></h3>
      </div>
      <div className="box-body" id="cups">
        <div className="row">
          <div className="col-md-12">
            <table className="text-right">
              <thead>
                <tr>
                  <th>CDP Id</th>
                  <th title="Amount of outstanding SAI debt in a CDP">Debt (SAI)</th>
                  <th title="Amount of SKR collateral in a CDP">Locked (SKR)</th>
                  <th title="Ratio of collateral SKR to total outstanding SKR">% Tot (SKR)</th>
                  <th title="Collateral ratio of the CDP">% Ratio</th>
                  <th title="Maximum Sai that can currently be drawn from a CDP">Avail. SAI (to draw)</th>
                  <th title="Maximum SKR that can currently be released from a CDP">Avail. SKR (to free)</th>
                  <th title="ETH price at which a CDP will become unsafe and at risk of liquidation">Liquidation Price</th>
                  <th title="Whether the CDP is safe, unsafe (vulnerable to liquidation), or closed">Status</th>
                  {
                    settings.chain[props.network.network]['service']
                    ?<th>History</th>
                    :<th></th>
                  }
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.keys(props.sai.tub.cups).map(key =>
                    <tr key={ key }>
                      <td>
                        { key }
                      </td>
                      <td>
                        { printNumber(props.tab(props.sai.tub.cups[key].art)) }
                      </td>
                      <td>
                        { printNumber(props.sai.tub.cups[key].ink) }
                      </td>
                      <td>
                        {
                          props.sai.skr.totalSupply.gte(0)
                            ? props.sai.skr.totalSupply.gt(0)
                              ? <span>{ printNumber(wdiv(props.sai.tub.cups[key].ink, props.sai.skr.totalSupply).times(100)) }%</span>
                              : <span title="0">0.000%</span>
                            : 'Loading...'
                        }
                      </td>
                      <td className={ props.sai.tub.off === false && props.sai.tub.cups[key].ratio && props.sai.tub.cups[key].art.gt(web3.toBigNumber(0))
                                      ? (web3.toWei(props.sai.tub.cups[key].ratio).lte(props.sai.tub.mat.times(1.1))
                                        ? 'error-color'
                                        : (web3.toWei(props.sai.tub.cups[key].ratio).lte(props.sai.tub.mat.times(1.5)) ? 'warning-color' : 'success-color'))
                                      : '' }>
                        {
                          props.sai.tub.off === false
                            ? props.sai.tub.cups[key].art.gt(web3.toBigNumber(0)) && props.sai.tub.cups[key].pro
                              ? <span>
                                  { printNumber(web3.toWei(props.sai.tub.cups[key].ratio).times(100)) }%
                                </span>
                              : '-'
                            : '-'
                        }
                      </td>
                      <td>
                        { props.sai.tub.off === false ? printNumber(props.sai.tub.cups[key].avail_sai) : '-' }
                      </td>
                      <td>
                        { props.sai.tub.off === false ? printNumber(props.sai.tub.cups[key].avail_skr) : '-' }
                      </td>
                      <td>
                        { props.sai.tub.off === false && props.sai.tub.cups[key].liq_price && props.sai.tub.cups[key].liq_price.gt(0) ? printNumber(props.sai.tub.cups[key].liq_price) : '-' }
                      </td>
                      <td className={ `text-center ${ props.sai.tub.off === false ? (props.sai.tub.cups[key].lad !== '0x0000000000000000000000000000000000000000' ? (props.sai.tub.cups[key].safe ? 'success-color' : 'error-color') : 'warning-color') : '' }` }>
                        {
                          props.sai.tub.off === false
                          ?
                            props.sai.tub.cups[key].lad === '0x0000000000000000000000000000000000000000'
                            ?
                              'Closed'
                            :
                              props.sai.tub.cups[key].safe === 'N/A' || props.sai.pip.val.lt(0)
                              ?
                                'N/A'
                              :
                                props.sai.tub.cups[key].safe
                                ?
                                  'Safe'
                                :
                                  'Unsafe'
                          :
                            '-'
                        }
                      </td>
                      {
                        settings.chain[props.network.network]['service']
                        ?<td><a href="#action" data-id={ key } onClick={ props.handleOpenCupHistoryModal }>Show</a></td>
                        :<td></td>
                      }
                      <td className="text-left">
                        { renderCupActions(props.sai.pip.val, props.network.defaultAccount, props.sai.tub.off, props.sai.skr.myBalance && props.sai.skr.myBalance.gt(0), key, props.sai.tub.cups[key], props.handleOpenModal, props.network.defaultAccount) }
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cups;
