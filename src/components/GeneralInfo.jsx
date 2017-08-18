import React, { Component } from 'react';
import web3 from  '../web3';

import { etherscanAddress } from '../helpers';

class GeneralInfo extends Component {

  changeTub = (e) => {
    e.preventDefault();
    const top = this.top ? this.top.value : null;
    const lpc = this.lpc ? this.lpc.value : null;
    if (top) {
      //this.form.reset();
      this.props.initContracts(top, lpc);
    }
  }

  render() {
    return (
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">General Info</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <div className="col-md-6">
              <div><strong>Network:</strong> { this.props.network === 'main' ? 'mainnet' : this.props.network }</div>
              { this.props.lpc ? <div><strong>LPC:</strong> { etherscanAddress(this.props.network, this.props.lpc, this.props.lpc) }</div> : '' }
              <div>
                <strong>Account:</strong> { this.props.account
                                            ? etherscanAddress(this.props.network, this.props.account, this.props.account)
                                            : <span style={{ 'color': 'red' }}>
                                                { web3.currentProvider.constructor.name === 'MetamaskInpageProvider'
                                                ? 'METAMASK ACCOUNT LOCKED'
                                                : 'NO ACCOUNT FOUND - READ ONLY MODE'
                                                }
                                              </span> }
              </div>
              <div>
                <strong>Role:</strong> { this.props.role === 'undefined' ? 'Loading...' : this.props.role  }
              </div>
              <a data-toggle="collapse" data-parent="#accordion" href="#collapseAddresses" aria-expanded="false" id="toggle-addresses" className="collapsed">
                <span>Show</span><span>Hide</span> contracts addresses
              </a>
              <div id="collapseAddresses" className="panel-collapse collapse" aria-expanded="false" style={{ height: "0px" }}>
                <div><strong>Sai:</strong> { etherscanAddress(this.props.network, this.props.sai, this.props.sai) }</div>
                <div><strong>Top:</strong> { etherscanAddress(this.props.network, this.props.top, this.props.top) }</div>
                <div><strong>Tub:</strong> { etherscanAddress(this.props.network, this.props.tub, this.props.tub) }</div>
                <div><strong>Tap:</strong> { etherscanAddress(this.props.network, this.props.tap, this.props.tap) }</div>
                <div><strong>Jar:</strong> { etherscanAddress(this.props.network, this.props.jar, this.props.jar) }</div>
                <div><strong>Tip:</strong> { etherscanAddress(this.props.network, this.props.tip, this.props.tip) }</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="box-group" id="accordion">
                <div className="panel box box-primary collapsed">
                  <div className="box-header with-border" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false">
                    <h3 className="box-title">
                      Change Top{ this.props.lpc ? ' and LPC' : '' }
                    </h3>
                  </div>
                  <div id="collapseOne" className="panel-collapse collapse" aria-expanded="false" style={{ height: "0px" }}>
                    <div className="box-body">
                      <form ref={(input) => this.form = input} onSubmit={this.changeTub} className="form-horizontal">
                        <div className="form-group">
                          <label htmlFor="tubInput" className="col-sm-3 control-label">Top Address</label>
                          <div className="col-sm-9">
                            <input ref={(input) => this.top = input} id="topInput" type="text" className="form-control" placeholder="Enter a valid top address" />
                          </div>
                        </div>
                        {
                          this.props.lpc &&
                          <div className="form-group">
                            <label htmlFor="lpcInput" className="col-sm-3 control-label">LPC Address</label>
                            <div className="col-sm-9">
                              <input ref={(input) => this.lpc = input} id="lpcInput" type="text" className="form-control" placeholder="Enter a valid lpc address" />
                            </div>
                          </div>
                        }
                        <button type="submit" className="btn btn-info pull-right">Update</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GeneralInfo;
