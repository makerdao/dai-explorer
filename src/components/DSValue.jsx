import React from 'react';
import web3 from '../web3';
import AnimatedNumber from '../AnimatedNumber';
import { formatNumber } from '../helpers';

var dsvalue = require('../config/dsvalue');

class DSValue extends React.Component {

  state = {
    value: null,
    valid: null
  }

  componentWillMount() {
    this.v = web3.eth.contract(dsvalue.abi).at(this.props.address);
    this.filter = this.v.LogNote({}, (e,r) => {
      this.update();
    })
    this.update();
  }

  componentWillUnmount() {
    this.filter.stopWatching();
  }

  update = () => {
    this.v.peek((error, res) => {
      if (!error) {
        this.setState({
          value: res[0],
          valid: res[1]
        })
      }
    });
  }

  render() {
    return(
      <div>
        <span className={`label label-${this.state.valid ? 'success' : 'danger'}`}>
          {this.state.valid ? 'VALID' : 'INVALID'}
        </span>
        &nbsp;
        <strong>
          <AnimatedNumber
            value={web3.toBigNumber(this.state.value)}
            title={formatNumber(this.state.value)}
            formatValue={ n => formatNumber(n, 3) } />
        </strong>
      </div>
    );
  }
}

export default DSValue;
