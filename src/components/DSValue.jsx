import React from 'react';
import web3 from '../web3';
import AnimatedNumber from '../AnimatedNumber';

var dsvalue = require('../config/dsvalue');

class DSValue extends React.Component {

  state = {
    value: null,
    valid: null
  }

  componentWillMount() {
    this.v = web3.eth.contract(dsvalue.abi).at(this.props.address);
    this.v.peek((error, res) => {
      if (!error) {
        this.setState({
          value: web3.toDecimal(res[0]),
          valid: res[1]
        })
      }
    });
  }

  componentWillUnmount() {

  }

  render() {
    return(
      <div>
        {this.state.value} {this.state.valid ? 'true' : 'false'}
      </div>
    );
  }
}

export default DSValue;
