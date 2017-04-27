import React from 'react';

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
        </div>
      </div>
    </div>
  )
}

export default GeneralInfo;
