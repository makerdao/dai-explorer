import React from 'react';
import web3 from '../web3';

const renderCupActions = (off, lock, cupId, cup, handleOpenModal, defaultAccount) => {
  const actions = [];
  if (off && cup.lad === defaultAccount) {
    actions.push('bail');
  } else if (off === false) {
    if (cup.lad === defaultAccount) {
      if (lock) {
        actions.push('lock');
      }
      if (cup.ink.gt(0) && cup.safe) {
        actions.push('free');
        actions.push('draw');
      }
      if (cup.art.gt(0)) {
        actions.push('wipe');
      }
      actions.push('shut');
      actions.push('give');
    }

    if (cup.safe === false) {
      actions.push('bite');
    }
  }
  
  return (
    <span>
      {
        Object.keys(actions).map(key =>
          <span key={ key }><a href="#" data-method={ actions[key] } data-cup={ cupId } onClick={ handleOpenModal }>{ actions[key] }</a> / </span>
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
            <table>
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
                        { props.toNumber(props.sai.tub.cups[key].art).toFixed(3) }
                      </td>
                      <td>
                        { props.toNumber(props.sai.tub.cups[key].ink).toFixed(3) }
                      </td>
                      <td>
                        {
                          props.sai.skr.totalSupply
                            ? props.sai.tub.cups[key].ink.div(props.sai.skr.totalSupply).times(100).toNumber().toFixed(3)
                            : '0.000'
                        }%
                      </td>
                      <td>
                        {
                          props.sai.tub.off === false
                            ? (props.sai.tub.cups[key].art.gt(web3.toBigNumber(0)) && props.sai.tub.cups[key].pro
                              ? `${ props.sai.tub.cups[key].pro.div(props.sai.tub.cups[key].art).times(100).toNumber().toFixed(3) }%`
                              : 'N/A')
                            : '-'
                        }
                      </td>
                      <td>
                        { props.sai.tub.off === false ? props.toNumber(props.sai.tub.cups[key].avail_sai).toFixed(3) : '-' }
                      </td>
                      <td>
                        { props.sai.tub.off === false ? props.toNumber(props.sai.tub.cups[key].avail_skr).toFixed(3) : '-' }
                      </td>
                      <td style={props.sai.tub.cups[key].safe ? { 'backgroundColor': 'green' } : { 'backgroundColor': 'red' }}>
                        {
                          props.sai.tub.cups[key].lad === '0x0000000000000000000000000000000000000000'
                          ? 'Closed'
                          : (props.sai.tub.cups[key].safe === 'N/A'
                            ? 'N/A'
                            : props.sai.tub.cups[key].safe ? 'Safe' : 'Unsafe')
                        }
                      </td>
                      <td>
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