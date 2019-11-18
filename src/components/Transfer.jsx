import React, { Component } from 'react';
import web3 from '../web3';

const settings = require('../settings');

class Transfer extends Component {
  state = {
    to: '',
    error: ''
  };

  fillTo = (e) => {
    e.preventDefault();
    this.setState({ to: e.target.getAttribute('data-address')});
  }

  onChangeTo = () => {
    this.setState({ to: this.to.value});
  }

  transfer = (e) => {
    e.preventDefault();
    const token = this.token.value;
    const to = web3.isAddress(this.to.value) ? this.to.value : false;
    const amount = this.amount.value
    this.setState({ error: '' });

    if (!to) {
      this.setState({ error: 'Invalid Address' });
    } else if (!amount) {
      this.setState({ error: 'Invalid Amount' });
    } else if (this.props.system[token].myBalance.lt(web3.toWei(amount))) {
      this.setState({ error: `Not enough balance to transfer ${amount} ${token}` });
    } else if (token) {
      this.props.transferToken(token, to, amount);
      this.to.value = '';
      this.amount.value = '';
    }
  }

  renderError = () => {
    return (
      <p className="error">
        { this.state.error }
      </p>
    )
  }

  render = () => {
    return (
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Transfer</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-md-12">
              <div>
                <form className="transfer" ref={(input) => this.transferForm = input} onSubmit={(e) => this.transfer(e)}>
                  <label>Token</label>
                  <select ref={(input) => this.token = input} >
                    <option value="gem">WETH</option>
                    <option value="gov">MKR</option>
                    <option value="dai">SAI</option>
                    <option value="skr">PETH</option>
                  </select>
                  {
                    settings.chain[this.props.network].proxyFactory
                    ? <label>&nbsp;</label>
                    : ''
                  }
                  {
                    settings.chain[this.props.network].proxyFactory
                    ?
                      this.props.profile.mode === 'proxy'
                      ? <a href="#acction" data-address={ this.props.account } onClick={ this.fillTo }>Send to your main account</a>
                      : <a href="#acction" data-address={ this.props.profile.proxy } onClick={ this.fillTo }>Send to your proxy profile</a>
                    :
                      ''
                  }
                  <label>
                    To
                  </label>
                  <input ref={(input) => this.to = input} value={ this.state.to } onChange={ this.onChangeTo } type="text" placeholder="0x" />
                  <label>Amount</label>
                  <input ref={(input) => this.amount = input} type="number" placeholder="0.00" step="0.000000000000000001" />
                  <input type="submit" />
                  { this.state.error ? this.renderError() : '' }
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
