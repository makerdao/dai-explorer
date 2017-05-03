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
        <span className={`label label-${this.state.valid ? 'success' : 'danger'}`}> </span>&nbsp;
        <AnimatedNumber value={web3.toDecimal(this.state.value)} title={this.state.value} />
      </div>
    );
  }
}

export default DSValue;
