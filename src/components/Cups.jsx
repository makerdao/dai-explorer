import React from 'react';

// Start Render functions
const renderBiteAction = () => {
  return (
    <span>
      <a href="">Bite</a>/
    </span>
  )
}

const renderOwnerCupActions = (cup, handleOpenModal) => {
  return (
    <span>
      <a href="#" data-method="lock" data-cup={ cup } onClick={ handleOpenModal }>Lock</a> -&nbsp;
      <a href="#" data-method="free" data-cup={ cup } onClick={ handleOpenModal }>Free</a> -&nbsp;
      <a href="#" data-method="draw" data-cup={ cup } onClick={ handleOpenModal }>Draw</a> -&nbsp;
      <a href="#" data-method="wipe" data-cup={ cup } onClick={ handleOpenModal }>Wipe</a> -&nbsp;
      <a href="#" data-method="shut" data-cup={ cup } onClick={ handleOpenModal }>Shut</a> -&nbsp;
      <a href="#" data-method="give" data-cup={ cup } onClick={ handleOpenModal }>Give</a>
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
                        { (props.sai.tub.cups[key].owner === props.network.defaultAccount) ? renderOwnerCupActions(key, props.handleOpenModal) : '' }
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