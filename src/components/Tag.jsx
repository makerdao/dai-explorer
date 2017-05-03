import React from 'react';
import DSValue from './DSValue';
import web3 from '../web3';
import AnimatedNumber from '../AnimatedNumber';
import { toBytes12, formatNumber } from '../helpers';

const medianizer = require('../config/medianizer');

class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      last: 0,
      values: []
    };
  }
  componentWillMount() {
    this.m = web3.eth.contract(medianizer.abi).at(this.props.address);
    window.m = this.m;
    this.get(this.m, 'next')
      .then(r => {
        this.setState({ last: web3.toDecimal(r) - 1});
        this.getAll(this.m, web3.toDecimal(r) - 1);
      });;
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

  getAll(m, last) {
    var p = [];
    for(let i = 1; i <= last; i++) {
      p.push(this.getValueAddress(m, toBytes12(i)));
    }
    return new Promise((resolve, reject) => {
      Promise.all(p).then(x => {
        this.setState({ values: x });
      });
    })
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
                  Current Value: <strong><AnimatedNumber
                    value={this.props.tag}
                    title={formatNumber(this.props.tag)}
                    formatValue={ n => formatNumber(n, 3) } /></strong> USD/ETH
                </p>
                <p>
                  Minimun Valid Sources: <strong>{this.state.min}</strong> Total: <strong>{this.state.last}</strong>
                </p>
                {this.state.values.map(x => <DSValue key={x} address={x} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tag;
