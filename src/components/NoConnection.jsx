import React from 'react';

const NoConnection = () => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="callout callout-warning">
          <h4>Connecting to Ethereum</h4>
          <p>
            {
              typeof window.ethereum !== "undefined"
              ?
                "Waiting for user approval..."
              :
                "Waiting for node connection..."
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default NoConnection;
