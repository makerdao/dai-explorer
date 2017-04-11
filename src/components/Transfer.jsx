import React, { Component } from 'react';
import web3 from '../web3';

class Transfer extends Component {
  transfer = (e) => {
    e.preventDefault();
    const token = this.token.value;
    const to = this.to.value
    const amount = this.amount.value

    this.props.transferToken(token, to, amount);

    this.transferForm.reset();
  }

  render() {
    return (
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Transfer</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-md-12">
              <div>
                <form ref={(input) => this.transferForm = input} onSubmit={(e) => this.transfer(e)}>
                  <div>
                    <label>Token</label>
                    <select ref={(input) => this.token = input} >
                      <option value="gem">GEM</option>
                      <option value="skr">SKR</option>
                      <option value="sai">SAI</option>
                    </select>
                  </div>
                  <div>
                    <label>To</label>
                    <input ref={(input) => this.to = input} type="text" placeholder="0x" />
                  </div>
                  <div>
                    <label>Amount</label>
                    <input ref={(input) => this.amount = input} type="number" placeholder="0.00" />
                  </div>
                  <input type="submit" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Transfer;