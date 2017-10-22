import React, { Component } from 'react';

class TokenAllowance extends Component {
  state = {
    error: ''
  };

  change = (e) => {
    const token = e.target.getAttribute('data-token');
    const dst = e.target.getAttribute('data-dst');
    const val = e.target.getAttribute('data-val') === 'true';

    this.props.trust(token, dst, val);
  }

  onOff = (token, dst) => {
    return (
      <div className="onoffswitch">
        <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id={`myonoffswitchp${token}${dst}`} checked={ this.props.sai[token][`${dst}Trusted`] } data-token={ token } data-dst={ dst } data-val={ !this.props.sai[token][`${dst}Trusted`] } onChange={ this.change } />
        <label className="onoffswitch-label" htmlFor={`myonoffswitchp${token}${dst}`}>
            <span className="onoffswitch-inner"></span>
            <span className="onoffswitch-switch"></span>
        </label>
      </div>
    )
  }

  render = () => {
    return (
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Token Allowance</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-md-12">
              <div className="trust">
                <div>
                  <span>SKR</span>
                  <span>Exit/Lock</span>
                  <span>
                    {
                      this.props.sai.skr.tubTrusted === -1
                      ? 'Loading...'
                      : this.onOff('skr', 'tub')
                    }
                  </span>
                </div>
                <div>
                  <span>SKR</span>
                  <span>Boom</span>
                  <span>
                    {
                      this.props.sai.skr.tapTrusted === -1
                      ? 'Loading...'
                      : this.onOff('skr', 'tap')
                    }
                  </span>
                </div>
                <div>
                  <span>MKR</span>
                  <span>Wipe/Shut</span>
                  <span>
                    {
                      this.props.sai.gov.tubTrusted === -1
                      ? 'Loading...'
                      : this.onOff('gov', 'tub')
                    }
                  </span>
                </div>
                <div>
                  <span>SAI</span>
                  <span>Wipe/Shut</span>
                  <span>
                    {
                      this.props.sai.sai.tubTrusted === -1
                      ? 'Loading...'
                      : this.onOff('sai', 'tub')
                    }
                  </span>
                </div>
                <div>
                  <span>SAI</span>
                  <span>Bust/Cash</span>
                  <span>
                    {
                      this.props.sai.sai.tapTrusted === -1
                      ? 'Loading...'
                      : this.onOff('sai', 'tap')
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TokenAllowance;