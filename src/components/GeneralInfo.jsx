import React, { Component } from 'react';

import { etherscanAddress } from '../helpers';

class GeneralInfo extends Component {

  changeTub = (e) => {
    e.preventDefault();
    const tub = this.tub.value;
    const tap = this.tap.value;
    const top = this.top.value;
    const lpc = this.lpc.value;
    if (tub && lpc) {
      //this.form.reset();
      this.props.initContracts(tub, tap, top, lpc);
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
              <div><strong>Network:</strong> { this.props.network }</div>
              <div><strong>Tub:</strong> { etherscanAddress(this.props.network, this.props.tub, this.props.tub) }</div>
              <div><strong>Tap:</strong> { etherscanAddress(this.props.network, this.props.tap, this.props.tap) }</div>
              <div><strong>Top:</strong> { etherscanAddress(this.props.network, this.props.top, this.props.top) }</div>
              <div><strong>LPC:</strong> { etherscanAddress(this.props.network, this.props.lpc, this.props.lpc) }</div>
              <div><strong>Account:</strong> { etherscanAddress(this.props.network, this.props.account, this.props.account) }</div>
              <div><strong>Role:</strong> { this.props.role === 'undefined' ? 'Loading...' : this.props.role  }</div>
            </div>
            <div className="col-md-6">
              <div className="box-group" id="accordion">
                <div className="panel box box-primary">
                  <div className="box-header with-border">
                    <h4 className="box-title">
                      <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" className="collapsed">
                        Change Tub, Tap, Top and LPC
                        </a>
                    </h4>
                  </div>
                  <div id="collapseOne" className="panel-collapse collapse" aria-expanded="false" style={{ height: "0px" }}>
                    <div className="box-body">
                      <form ref={(input) => this.form = input} onSubmit={this.changeTub} className="form-horizontal">
                        <div className="form-group">
                          <label htmlFor="tubInput" className="col-sm-3 control-label">Tub Address</label>
                          <div className="col-sm-9">
                            <input ref={(input) => this.tub = input} id="tubInput" type="text" className="form-control" placeholder="Enter a valid tub address" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="tubInput" className="col-sm-3 control-label">Tap Address</label>
                          <div className="col-sm-9">
                            <input ref={(input) => this.tub = input} id="tapInput" type="text" className="form-control" placeholder="Enter a valid tap address" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="tubInput" className="col-sm-3 control-label">Top Address</label>
                          <div className="col-sm-9">
                            <input ref={(input) => this.tub = input} id="topInput" type="text" className="form-control" placeholder="Enter a valid top address" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="lpcInput" className="col-sm-3 control-label">LPC Address</label>
                          <div className="col-sm-9">
                            <input ref={(input) => this.lpc = input} id="lpcInput" type="text" className="form-control" placeholder="Enter a valid lpc address" />
                          </div>
                        </div>
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
