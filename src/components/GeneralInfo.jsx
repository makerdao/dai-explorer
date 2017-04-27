import React from 'react';
import Faucet from './Faucet';

const GeneralInfo = (props) => {
  return (
    <div className="box">
      <div className="box-header with-border">
        <h3 className="box-title">General Info</h3>
      </div>
      <div className="box-body">
        <div className="row">
          <div className="col-md-12 general-info">
            <div><strong>Network:</strong> { props.network }</div>
            <div><strong>Contract:</strong> { props.contract }</div>
            <div><strong>Account:</strong> { props.account }</div>
          </div>
          {props.network === 'kovan' && <Faucet account={props.account} gem={props.gem} />}
        </div>
      </div>
    </div>
  )
}

export default GeneralInfo;
