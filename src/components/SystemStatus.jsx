import React from 'react';
import web3 from '../web3';

const SystemStatus = (props) => {
  return (
    <div className="box">
      <div className="box-header with-border">
        <h3 className="box-title">SAI Status</h3>
      </div>
      <div className="box-body">
        <div className="row">
          <div className="col-md-12">
            <table>
              <thead>
                <tr>
                  <th>SKR/ETH</th>
                  <th>USD/ETH</th>
                  <th>Liq. Ratio</th>
                  <th>Liq. Penalty</th>
                  <th>Debt Ceiling</th>
                  <th>Deficit</th>
                  <th>Safe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                    <td>
                      { props.toNumber(props.sai.tub.per) }
                    </td>
                    <td>
                      { props.toNumber(props.sai.tub.tag) }
                    </td>
                    <td>
                      { props.toNumber(web3.fromWei(props.sai.tub.axe)) }
                    </td>
                    <td>
                      { props.toNumber(web3.fromWei(props.sai.tub.mat)) }
                    </td>
                    <td>
                      { props.toNumber(props.sai.tub.hat) }
                    </td>
                    <td>
                      { props.sai.tub.eek ? 'YES' : 'NO' }
                    </td>
                    <td>
                      { props.sai.tub.safe ? 'YES' : 'NO' }
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus;
