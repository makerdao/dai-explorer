import React, { Component } from 'react';

class GeneralInfo extends Component {

  changeTub = (e) => {
    e.preventDefault();
    console.log(this.tub.value);
    console.log(this.lpc.value);
    //this.props.initContracts(this.tub.value);
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
                  <label htmlFor="inputEmail3" className="col-sm-2 control-label">Tub Address</label>
                  <div className="col-sm-10">
                    <input type="email" className="form-control" id="inputEmail3" placeholder="Email" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="inputEmail3" className="col-sm-2 control-label">LPC Address</label>
                  <div className="col-sm-10">
                    <input type="email" className="form-control" id="inputEmail3" placeholder="Email" />
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
