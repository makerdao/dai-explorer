import React from 'react';
import web3 from '../web3';
import { printNumber, wdiv } from '../helpers';

const renderCupActions = (hasUserRights, reg, lock, cupId, cup, handleOpenModal, defaultAccount) => {
  const actions = {
    lock: hasUserRights && reg.eq(0) && cup.lad === defaultAccount && lock,
    free: hasUserRights && cup.lad === defaultAccount && cup.ink.gt(0) && cup.safe,
    draw: hasUserRights && reg.eq(0) && cup.lad === defaultAccount && cup.ink.gt(0) && cup.safe,
    wipe: hasUserRights && reg.eq(0) && cup.lad === defaultAccount && cup.art.gt(0),
    shut: hasUserRights && reg.eq(0) && cup.lad === defaultAccount,
    give: hasUserRights && reg.eq(0) && cup.lad === defaultAccount,
    bite: hasUserRights && ((reg.eq(1) && cup.art.gt(0)) || cup.safe === false),
  };

  const helpers = {
    lock: 'Deposit SKR in this CUP',
    free: 'Withdraw SKR from this CUP',
    draw: 'Mint SAI from the SKR locked amount',
    wipe: 'Burn SAI previously minted',
    shut: 'Close this CUP',
    give: 'Transfer this CUP',
    bite: 'Liquidate this CUP',
  };

  return (
    <span>
      {
        Object.keys(actions).map(key =>
          <span key={ key }>
            { actions[key] ? <a href="#action" data-method={ key } data-cup={ cupId } onClick={ handleOpenModal } title={ helpers[key] }>{ key }</a> : key }
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
        <h3 className="box-title">{ props.all ? 'All' : 'My' } Cups</h3>
      </div>
      <div className="box-body" id="cups">
        <div className="row">
          <div className="col-md-12">
            <table className="text-right">
              <thead>
                <tr>
                  <th>Cup</th>
                  <th>Debt (SAI)</th>
                  <th>Locked (SKR)</th>
                  <th>% Tot SKR</th>
                  <th>% Ratio</th>
                  <th>Avail. SAI (to draw)</th>
                  <th>Avail. SKR (to free)</th>
                  <th>Liquidation price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.keys(props.sai.tub.cups).map(key =>
                    <tr key={key}>
                      <td>
                        {key}
                      </td>
                      <td>
                        { printNumber(props.tab(props.sai.tub.cups[key].art)) }
                      </td>
                      <td>
                        { printNumber(props.sai.tub.cups[key].ink) }
                      </td>
                      <td>
                        {
                          props.sai.skr.totalSupply
                            ? printNumber(wdiv(props.sai.tub.cups[key].ink, props.sai.skr.totalSupply).times(100))
                            : <span title="0">0.000</span>
                        }%
                      </td>
                      <td className={ props.sai.tub.reg.eq(0) && props.sai.tub.cups[key].ratio && props.sai.tub.cups[key].art.gt(web3.toBigNumber(0))
                                      ? (web3.toWei(props.sai.tub.cups[key].ratio).lte(props.sai.tub.mat.times(1.1))
                                        ? 'error-color'
                                        : (web3.toWei(props.sai.tub.cups[key].ratio).lte(props.sai.tub.mat.times(1.5)) ? 'warning-color' : 'success-color'))
                                      : '' }>
                        {
                          props.sai.tub.reg.eq(0)
                            ? props.sai.tub.cups[key].art.gt(web3.toBigNumber(0)) && props.sai.tub.cups[key].pro
                              ? <span>
                                  { printNumber(web3.toWei(props.sai.tub.cups[key].ratio).times(100)) }%
                                </span>
                              : '-'
                            : '-'
                        }
                      </td>
                      <td>
                        { props.sai.tub.reg.eq(0) ? printNumber(props.sai.tub.cups[key].avail_sai) : '-' }
                      </td>
                      <td>
                        { props.sai.tub.reg.eq(0) ? printNumber(props.sai.tub.cups[key].avail_skr) : '-' }
                      </td>
                      <td>
                        { props.sai.tub.reg.eq(0) && props.sai.tub.cups[key].liq_price && props.sai.tub.cups[key].liq_price.gt(0) ? printNumber(props.sai.tub.cups[key].liq_price) : '-' }
                      </td>
                      <td className={ `text-center ${ props.sai.tub.reg.eq(0) ? (props.sai.tub.cups[key].lad !== '0x0000000000000000000000000000000000000000' ? (props.sai.tub.cups[key].safe ? 'success-color' : 'error-color') : 'warning-color') : '' }` }>
                        {
                          props.sai.tub.reg.eq(0)
                          ?
                            (
                            props.sai.tub.cups[key].lad === '0x0000000000000000000000000000000000000000'
                            ?
                              'Closed'
                            :
                              (props.sai.tub.cups[key].safe === 'N/A'
                              ? 'N/A'
                              : props.sai.tub.cups[key].safe ? 'Safe' : 'Unsafe')
                            )
                          :
                            '-'
                        }
                      </td>
                      <td className="text-left">
                        { renderCupActions(props.hasUserRights(), props.sai.tub.reg, props.sai.skr.myBalance && props.sai.skr.myBalance.gt(0), key, props.sai.tub.cups[key], props.handleOpenModal, props.network.defaultAccount) }
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
