import React, { Component } from 'react';

class GeneralInfo extends Component {

  changeTub = (e) => {
    e.preventDefault();
    const tub = this.tub.value;
    const lpc = this.lpc.value;
    if (tub && lpc) {
      //this.form.reset();
      this.props.initContracts(tub, lpc);
    }
  }

  render() {
    return (
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">General Info</h3>
        </div>
        <form ref={(input) => this.form = input} onSubmit={this.changeTub} className="form-horizontal">
          <div className="box-body">
            <div className="row">
              <div className="col-md-6">
                <div><strong>Network:</strong> { this.props.network }</div>
                <div><strong>Tub:</strong> { this.props.tub }</div>
                <div><strong>LPC:</strong> { this.props.lpc }</div>
                <div><strong>Account:</strong> { this.props.account }</div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="tubInput" className="col-sm-2 control-label">Tub Address</label>
                  <div className="col-sm-10">
                    <input ref={(input) => this.tub = input} id="tubInput" type="text" className="form-control" placeholder="Enter a valid tub address" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="lpcInput" className="col-sm-2 control-label">LPC Address</label>
                  <div className="col-sm-10">
                    <input ref={(input) => this.lpc = input} id="lpcInput" type="text" className="form-control" placeholder="Enter a valid lpc address" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="box-footer">
            <button type="submit" className="btn btn-info pull-right">Update</button>
          </div>
        </form>
      </div>
    )
  }
}

export default GeneralInfo;
