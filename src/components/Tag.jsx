import React from 'react';
import Value from './Value';
import web3 from '../web3';
import AnimatedNumber from '../AnimatedNumber';
import { toBytes12 } from '../helpers';

const medianizer = require('../config/medianizer');

class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      last: 0,
    };
  }
  componentWillMount() {
    this.m = web3.eth.contract(medianizer.abi).at(this.props.address);
    window.m = this.m;
    this.get(this.m, 'next')
      .then(r => {
        this.setState({ last: web3.toDecimal(r) - 1});
        this.getValueAddress(this.m, toBytes12(1));
      })
    this.get(this.m, 'min')
      .then(r => {
        this.setState({ min: web3.toDecimal(r) });
      })
  }

  get(m, func) {
    return new Promise((resolve, reject) => {
      m[func]((e,r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      })
    });
  }

  getValueAddress(m, pos) {
    return new Promise((resolve, reject) => {
      m.values(pos, (e,r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      })
    });
  }

  render() {
    return(
      <div className="col-md-3">
        <div className="box">
          <div className="box-header with-border">
            <h3 className="box-title">Tag Sources</h3>
          </div>
          <div className="box-body">
            <div className="row">
              <div className="col-md-12">
                <p>
                  Min: {this.state.min} Last: {this.state.last}
                </p>
                <AnimatedNumber value={this.props.tag} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tag;
