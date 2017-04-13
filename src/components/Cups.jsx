import React from 'react';

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
  if (cup.locked.valueOf() !== '0' && cup.safe) {
    actions.push('free');
    actions.push('draw');
  }
  if (cup.debt.valueOf() !== '0') {
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
                  <th>Debt (SIN)</th>
                  <th>Locked (SKR)</th>
                  <th>% SKR</th>
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
                        { props.toNumber(props.sai.tub.cups[key].debt) }
                      </td>
                      <td>
                        { props.toNumber(props.sai.tub.cups[key].locked) }
                      </td>
                      <td>
                        { props.sai.tub.cups[key].locked.div(props.sai.skr.totalSupply).times(100).toNumber().toFixed(3) }%
                      </td>
                      <td style={props.sai.tub.cups[key].safe ? { 'backgroundColor': 'green' } : { 'backgroundColor': 'red' }}>
                        {
                          (props.sai.tub.cups[key].owner === '0x0000000000000000000000000000000000000000')
                            ? 'Closed'
                            :
                            (props.sai.tub.cups[key].safe === 'N/A')
                              ? 'N/A'
                              : (props.sai.tub.cups[key].safe ? 'Safe' : 'Unsafe')
                        }
                      </td>
                      <td>
                        { !props.sai.tub.cups[key].safe ? renderBiteAction() : '' }
                        { (props.sai.tub.cups[key].owner === props.network.defaultAccount) ? renderOwnerCupActions(props.sai.skr.myBalance.valueOf() !== '0', key, props.sai.tub.cups[key], props.handleOpenModal) : '' }
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