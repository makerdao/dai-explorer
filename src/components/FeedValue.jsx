import React from 'react';
import DSValue from './DSValue';
import web3 from '../web3';
import AnimatedNumber from '../AnimatedNumber';
import { toBytes12, formatNumber, copyToClipboard } from '../helpers';

const medianizer = require('../abi/medianizer');

class FeedValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      last: 0,
      values: []
    };
  }
  componentDidMount() {
    this.m = web3.eth.contract(medianizer.abi).at(this.props.address);
    window.m = this.m;
    this.get(this.m, 'next')
      .then(r => {
        if (r !== '0x') {
          this.setState({ last: web3.toDecimal(r) - 1});
          this.getAll(this.m, web3.toDecimal(r) - 1);
        }
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
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Price Feed</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-md-12">
              <div>
                <p>
                  Current Value:&nbsp;
                  <strong>
                    <AnimatedNumber
                    value={ this.props.pipVal }
                    title={ formatNumber(this.props.pipVal) }
                    formatValue={ n => formatNumber(n, 3) }
                    className="printedNumber"
                    onClick = { copyToClipboard } />
                  </strong> USD/ETH
                </p>
                {
                  this.state.last
                  ?
                    <p>
                      Minimum Valid Sources: <strong>{ this.state.min }</strong> - Total: <strong>{ this.state.last }</strong>
                    </p>
                  :
                    ''
                }
                { this.state.values.map(x => <DSValue key={ x } address={ x } />) }
                <a target="_blank" rel="noopener noreferrer" href={ `http://makerdao.com/feeds/#${this.props.address}` }>Details</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FeedValue;
