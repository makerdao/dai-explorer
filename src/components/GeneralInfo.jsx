import React, { Component } from 'react';

class GeneralInfo extends Component {

  changeTub = (e) => {
    e.preventDefault();
    this.props.initContracts(this.tub.value);
  }

  render() {
    return (
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">General Info</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <form ref={(input) => this.form = input} onSubmit={this.changeTub} className="form-horizontal">
              <div className="col-md-6 general-info">
                <div className="input-group">
                  <input ref={(input) => this.tub = input} type="text" placeholder="Enter a valid tub address" className="form-control" />
                  <span className="input-group-btn">
                    <button className="btn btn-primary" type="submit">Change Tub</button>
                  </span>
                </div>
              </div>
              <div className="col-md-6 general-info">
                <div className="input-group">
                  <input ref={(input) => this.lpc = input} type="text" placeholder="Enter a valid lpc address" className="form-control" />
                  <span className="input-group-btn">
                    <button className="btn btn-primary" type="submit">Change LPC</button>
                  </span>
                </div>
              </div>
              <div className="col-md-12 general-info">
                <div><strong>Network:</strong> { this.props.network }</div>
                <div><strong>Contract:</strong> { this.props.contract }</div>
                <div><strong>Account:</strong> { this.props.account }</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default GeneralInfo;
