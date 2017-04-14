import React from 'react';
import web3 from '../web3';

// Start Render functions
const renderBiteAction = () => {
  return (
    <span>
      <a href="">Bite</a>/
    </span>
  )
}

const renderOwnerCupActions = (lock, cupId, cup, handleOpenModal) => {
  const actions = [];
  if (lock) {
    actions.push('lock');
  }
  if (cup.locked.gt(web3.toBigNumber(0)) && cup.safe) {
    actions.push('free');
    actions.push('draw');
  }
  if (cup.debt.gt(web3.toBigNumber(0))) {
    actions.push('wipe');
  }
  actions.push('shut');
  actions.push('give');
  
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
        <h3 className="box-title">My Cups</h3>
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
                  <th>% Ratio</th>
                  <th>% Tot SKR</th>
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
                        { props.toNumber(props.sai.tub.cups[key].debt).toFixed(3) }
                      </td>
                      <td>
                        { props.toNumber(props.sai.tub.cups[key].locked).toFixed(3) }
                      </td>
                      <td>
                        {
                          props.sai.tub.cups[key].debt.gt(web3.toBigNumber(0))
                            ? props.sai.tub.cups[key].pro.div(props.sai.tub.cups[key].debt).times(100).toNumber().toFixed(3)
                            : '0.000'
                        }%
                      </td>
                      <td>
                        {
                          props.sai.skr.totalSupply
                            ? props.sai.tub.cups[key].locked.div(props.sai.skr.totalSupply).times(100).toNumber().toFixed(3)
                            : '0.000'
                        }%
                      </td>
                      <td>
                        { props.toNumber(props.sai.tub.cups[key].pro.div(web3.fromWei(web3.fromWei(props.sai.tub.mat))).minus(props.sai.tub.cups[key].debt)).toFixed(3) }
                      </td>
                      <td>
                        { props.toNumber(props.sai.tub.cups[key].locked.minus(props.sai.tub.cups[key].debt.times(props.sai.tub.per).div(props.sai.tub.tag).times(web3.fromWei(web3.fromWei(props.sai.tub.mat))))).toFixed(3) }
                      </td>
                      <td style={props.sai.tub.cups[key].safe ? { 'backgroundColor': 'green' } : { 'backgroundColor': 'red' }}>
                        {
                          props.sai.tub.cups[key].safe === 'N/A'
                            ? 'N/A'
                            : props.sai.tub.cups[key].safe ? 'Safe' : 'Unsafe'
                        }
                      </td>
                      <td>
                        { !props.sai.tub.cups[key].safe ? renderBiteAction() : '' }
                        { (props.sai.tub.cups[key].owner === props.network.defaultAccount) ? renderOwnerCupActions(props.sai.skr.myBalance.gt(web3.toBigNumber(0)), key, props.sai.tub.cups[key], props.handleOpenModal) : '' }
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