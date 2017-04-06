import React, { Component } from 'react';
import web3 from './web3';
import Medianizer from './Medianizer';
import AddMedianizerForm from './AddMedianizerForm';
import { toBytes32 } from './helpers';
import logo from './logo.svg';
import './App.css';

var medianizer = require('./config/medianizer');
window.medianizer = medianizer;

var dsvalue = require('./config/dsvalue');
window.dsvalue = dsvalue;

class App extends Component {
  state = {
    account: null,
    medianizers: {}
  };

  constructor() {
    super();
    web3.eth.getAccounts((error, accounts) => {
      if (accounts) {
        web3.eth.defaultAccount = accounts[0];
        this.setState({
          account: accounts[0]
        });
      }
    });  }

  componentWillMount() {
    var medianizers = localStorage.getItem('medianizers');
    if (medianizers) {
      this.setState({
        medianizers: JSON.parse(medianizers)
      });
    }
  }

  createMedianizer = () => {
    var factory = web3.eth.contract(medianizer.abi);
    factory.new({data: medianizer.bytecode, gas: 3000000}, (error, res) => {
      if (res && res.address) {
        const medianizers = {...this.state.medianizers};
        medianizers[`m-${Date.now()}`] = {
          address: res.address,
          length: 0
        };
        this.setState({ medianizers });
        localStorage.setItem('medianizers', JSON.stringify(medianizers));
      }
    });
  };

  addMedianizer = (medianizer) => {
    // TODO: check if it's indeed a medianizer...
    const medianizers = {...this.state.medianizers};
    medianizers[`m-${Date.now()}`] = medianizer;
    this.setState({ medianizers });
    localStorage.setItem('medianizers', JSON.stringify(medianizers));
    // var factory = web3.eth.contract(medianizer.abi);
    // factory.new({data: medianizer.bytecode, gas: 3000000}, (error, res) => {
    //   if (res && res.address) {
    //     const medianizers = {...this.state.medianizers};
    //     medianizers[`m-${Date.now()}`] = {
    //       address: res.address,
    //       length: 0
    //     };
    //     this.setState({ medianizers });
    //     localStorage.setItem('medianizers', JSON.stringify(medianizers));
    //   }
    // });
  };

  readMedianizer = (address) => {
    var m = web3.eth.contract(medianizer.abi).at(address);
    m.read((e,r) => {
      if (!e) {
        console.log(r);
        console.log(web3.fromWei(r));
      }
    });
  };

  next = (address) => {
    var m = web3.eth.contract(medianizer.abi).at(address);
    m.next((e,r) => {
      if (!e) {
        const next = r.valueOf();
        console.log(next);
      }
    });
  }

  set = (address) => {
    var m = web3.eth.contract(medianizer.abi).at(address);
    var factory = web3.eth.contract(dsvalue.abi);
    factory.new({data: dsvalue.bytecode, gas: 1500000}, (error, res) => {
      if (res && res.address) {
        var v = factory.at(res.address);
        v.poke(toBytes32(`${44 + Math.random()}`), (e, r) => {
          console.log(`Set value to: ${44 + Math.random()}`);
          console.log('value', r);
        });
        m.set(res.address, (e, r) => {
          console.log(r);
        });
      }
    });
  };

  prod = (address, expiration) => {
    var m = web3.eth.contract(medianizer.abi).at(address);
    const zzz = parseInt(Date.now() / 1000, 10) + parseInt(expiration, 10);
    m.prod["uint128"](zzz, (e,r) => {
      console.log(r);
    })
  };

  remove = (address) => {
    const medianizers = {...this.state.medianizers};
    delete medianizers[address];
    this.setState({ medianizers });
    localStorage.setItem('medianizers', JSON.stringify(medianizers));
  };

  peekMedianizer = (address) => {
    var m = web3.eth.contract(medianizer.abi).at(address);
    m.peek((e,r) => {
      console.log(r);
    });
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          <button onClick={this.createMedianizer}>Create Medianizer</button>
        </p>
        <AddMedianizerForm addMedianizer={this.addMedianizer} />
        {Object.keys(this.state.medianizers).map(
          (key) => <Medianizer key={key} index={key} data={this.state.medianizers[key]} read={this.readMedianizer}
          next={this.next} set={this.set} remove={this.remove} prod={this.prod} />
        )}
      </div>
    );
  }
}

export default App;
