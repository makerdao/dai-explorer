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
            <div className="col-md-12 general-info">
              <form ref={(input) => this.form = input} onSubmit={this.changeTub} className="form-horizontal">
                <div className="input-group">
                  <input ref={(input) => this.tub = input} type="text" placeholder="Enter a valid tub address" type="text" className="form-control" />
                  <span className="input-group-btn">
                    <button className="btn btn-primary" type="submit">Change Tub</button>
                  </span>
                </div>
              </form>
              <div><strong>Network:</strong> { this.props.network }</div>
              <div><strong>Contract:</strong> { this.props.contract }</div>
              <div><strong>Account:</strong> { this.props.account }</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GeneralInfo;
