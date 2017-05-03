import React from 'react';
import web3 from '../web3';
import { formatNumber } from '../helpers';

const renderCupActions = (off, lock, cupId, cup, handleOpenModal, defaultAccount) => {
  const actions = {
    bail: off && cup.lad === defaultAccount,
    lock: off === false && cup.lad === defaultAccount && lock,
    free: off === false && cup.lad === defaultAccount && cup.ink.gt(0) && cup.safe,
    draw: off === false && cup.lad === defaultAccount && cup.ink.gt(0) && cup.safe,
    wipe: off === false && cup.lad === defaultAccount && cup.art.gt(0),
    shut: off === false && cup.lad === defaultAccount,
    give: off === false && cup.lad === defaultAccount,
    bite: off === false && cup.safe === false
  };

  return (
    <span>
      {
        Object.keys(actions).map(key =>
          <span key={ key }>
            { actions[key] ? <a href="#" data-method={ key } data-cup={ cupId } onClick={ handleOpenModal }>{ key }</a> : key }
            <span> / </span>
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
      <div className="box-body">
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
                        <span title={ formatNumber(props.sai.tub.cups[key].art) }>{ formatNumber(props.sai.tub.cups[key].art, 3) }</span>
                      </td>
                      <td>
                        <span title={ formatNumber(props.sai.tub.cups[key].ink) }>{ formatNumber(props.sai.tub.cups[key].ink, 3) }</span>
                      </td>
                      <td>
                        {
                          props.sai.skr.totalSupply
                            ? <span title={ formatNumber(props.sai.tub.cups[key].ink.div(props.sai.skr.totalSupply).times(100), false, false) }>
                                { formatNumber(props.sai.tub.cups[key].ink.div(props.sai.skr.totalSupply).times(100), 3, false) }
                              </span>
                            : <span title="0">0.000</span>
                        }%
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
                                  <span title={ formatNumber(props.sai.tub.cups[key].ratio.times(100), false, false) }>
                                    { formatNumber(props.sai.tub.cups[key].ratio.times(100), 3, false) }
                                  </span>%
                                </span>
                              : '-'
                            : '-'
                        }
                      </td>
                      <td>
                        { props.sai.tub.off === false ? <span title={ formatNumber(props.sai.tub.cups[key].avail_sai) }>{ formatNumber(props.sai.tub.cups[key].avail_sai, 3) }</span> : '-' }
                      </td>
                      <td>
                        { props.sai.tub.off === false ? <span title={ formatNumber(props.sai.tub.cups[key].avail_skr) }>{ formatNumber(props.sai.tub.cups[key].avail_skr, 3) }</span> : '-' }
                      </td>
                      <td className={ `text-center ${ props.sai.tub.cups[key].lad !== '0x0000000000000000000000000000000000000000' ? (props.sai.tub.cups[key].safe ? 'success-color' : 'error-color') : 'warning-color' }` }>
                        {
                          props.sai.tub.cups[key].lad === '0x0000000000000000000000000000000000000000'
                          ? 'Closed'
                          : (props.sai.tub.cups[key].safe === 'N/A'
                            ? 'N/A'
                            : props.sai.tub.cups[key].safe ? 'Safe' : 'Unsafe')
                        }
                      </td>
                      <td className="text-left">
                        { renderCupActions(props.sai.tub.off, props.sai.skr.myBalance && props.sai.skr.myBalance.gt(0), key, props.sai.tub.cups[key], props.handleOpenModal, props.network.defaultAccount) }
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
