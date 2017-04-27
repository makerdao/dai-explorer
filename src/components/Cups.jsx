import React from 'react';
import web3 from '../web3';
import { toNumber } from '../helpers';

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
                        <span title={ toNumber(props.sai.tub.cups[key].art).toFixed(3) }>{ toNumber(props.sai.tub.cups[key].art).toFixed(3) }</span>
                      </td>
                      <td>
                        <span title={ toNumber(props.sai.tub.cups[key].ink) }>{ toNumber(props.sai.tub.cups[key].ink).toFixed(3) }</span>
                      </td>
                      <td>
                        {
                          props.sai.skr.totalSupply
                            ? <span title={ props.sai.tub.cups[key].ink.div(props.sai.skr.totalSupply).times(100).toNumber() }>
                                { props.sai.tub.cups[key].ink.div(props.sai.skr.totalSupply).times(100).toNumber().toFixed(3) }
                              </span>
                            : <span title="0">0.000</span>
                        }%
                      </td>
                      <td>
                        {
                          props.sai.tub.off === false
                            ? (props.sai.tub.cups[key].art.gt(web3.toBigNumber(0)) && props.sai.tub.cups[key].pro
                              ? <span>
                                  <span title={ props.sai.tub.cups[key].pro.div(props.sai.tub.cups[key].art).times(100).valueOf() }>
                                    { props.sai.tub.cups[key].pro.div(props.sai.tub.cups[key].art).times(100).toNumber().toFixed(3) }
                                  </span>%
                                </span>
                              : '-')
                            : '-'
                        }
                      </td>
                      <td>
                        { props.sai.tub.off === false ? <span title={ toNumber(props.sai.tub.cups[key].avail_sai) }>{ toNumber(props.sai.tub.cups[key].avail_sai).toFixed(3) }</span> : '-' }
                      </td>
                      <td>
                        { props.sai.tub.off === false ? <span title={ toNumber(props.sai.tub.cups[key].avail_skr) }>{ toNumber(props.sai.tub.cups[key].avail_skr).toFixed(3) }</span> : '-' }
                      </td>
                      <td className="text-left" style={props.sai.tub.cups[key].safe ? { 'backgroundColor': 'green' } : { 'backgroundColor': 'red' }}>
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
