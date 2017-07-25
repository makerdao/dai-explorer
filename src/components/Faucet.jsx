import React from 'react';
import web3 from '../web3';

const settings = require('../settings');
const faucet = require('../abi/faucet');

class Faucet extends React.Component {
  constructor(props) {
    super(props);
    this.faucet = web3.eth.contract(faucet.abi).at(settings.chain.kovan.faucet);
    window.faucet = this.faucet;
    this.state = {
      claimed: null
    }
    this.faucet.who(this.props.account, (error, res) => {
      if (!error) {
        this.setState({ claimed: res })
      }
    });
  }

  claim = () => {
    this.faucet.give({}, (error, res) => {
      if (!error) {
        this.setState({ claimed: true });
      }
    });
  }

  render() {
    return (
      <div className="col-md-12 general-info">
        {this.state.claimed === false &&
          <button onClick={this.claim}>Claim Test GEM Tokens</button>
        }
      </div>
    )
  }
}

export default Faucet;
