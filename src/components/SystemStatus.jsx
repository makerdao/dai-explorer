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
                  <th>Avail. Boom</th>
                  <th>Avail. Bust</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    { props.toNumber(props.sai.tub.per).toFixed(3) }
                  </td>
                  <td>
                    { props.toNumber(props.sai.tub.tag).toFixed(3) }
                  </td>
                  <td>
                    { props.toNumber(web3.toBigNumber(web3.fromWei(props.sai.tub.mat)).times(100)).toFixed(3) }%
                  </td>
                  <td>
                    { props.toNumber(web3.toBigNumber(web3.fromWei(props.sai.tub.axe)).times(100)).toFixed(3) }%
                  </td>
                  <td>
                    { props.toNumber(props.sai.tub.hat).toFixed(3) }
                  </td>
                  <td>
                    { props.sai.tub.eek ? 'YES' : 'NO' }
                  </td>
                  <td>
                    { props.sai.tub.safe ? 'YES' : 'NO' }
                  </td>
                  <td>
                    Sell { props.toNumber(props.sai.tub.avail_boom_sai).toFixed(3) } SKR<br />
                    Buy { props.toNumber(props.sai.tub.avail_boom_skr).toFixed(3) } SAI
                  </td>
                  <td>
                    Sell { props.toNumber(props.sai.tub.avail_bust_sai).toFixed(3) } SAI<br />
                    Buy { props.toNumber(props.sai.tub.avail_bust_skr).toFixed(3) } SKR
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
