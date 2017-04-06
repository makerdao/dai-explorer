import React, { Component } from 'react';
import web3 from './web3';
import { toBytes32 } from './helpers';
import logo from './logo.svg';
import './App.css';

const addresses = require('./config/addresses');

const tub = require('./config/tub');
window.tub = tub;

const dstoken = require('./config/dstoken');
window.dstoken = dstoken;

const dsvault = require('./config/dsvault');
window.dsvault = dsvault;

const dsvalue = require('./config/dsvalue');
window.dsvalue = dsvalue;


class App extends Component {
  state = {
    network: {

    },
    sai: {
      tub: {
        per: 0,
        tag: 0,
        axe: 0,
        mat: 0,
        hat: 0,
        cups: {}
      },
      gem: {},
      skr: {},
      sai: {},
      sin: {},
      pot: {}
    }
  };

  checkNetwork = () => {
    web3.version.getNode((error) => {
      const isConnected = !error;

      // Check if we are synced
      if (isConnected) {
        web3.eth.getBlock('latest', (e, res) => {
          if (typeof(res) === 'undefined') {
            console.debug('YIKES! getBlock returned undefined!');
          }
          if (res.number >= this.state.network.latestBlock) {
            const networkState = {...this.state.network};
            networkState['latestBlock'] = res.number;
            networkState['outOfSync'] = e != null || ((new Date().getTime() / 1000) - res.timestamp) > 600;
            this.setState({ network: networkState });
          } else {
            // XXX MetaMask frequently returns old blocks
            // https://github.com/MetaMask/metamask-plugin/issues/504
            console.debug('Skipping old block');
          }
        });
      }

      // Check which network are we connected to
      // https://github.com/ethereum/meteor-dapp-wallet/blob/90ad8148d042ef7c28610115e97acfa6449442e3/app/client/lib/ethereum/walletInterface.js#L32-L46
      if (this.state.network.isConnected !== isConnected) {
        if (isConnected === true) {
          web3.eth.getBlock(0, (e, res) => {
            let network = false;
            if (!e) {
              switch (res.hash) {
                case '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9':
                  network = 'kovan';
                  break;
                case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
                  network = 'live';
                  break;
                default:
                  console.log('setting network to private');
                  console.log('res.hash:', res.hash);
                  network = 'private';
              }
            }
            if (this.state.network.network !== network) {
              this.initNetwork(network);
            }
          });
        } else {
          const networkState = {...this.state.network};
          networkState['isConnected'] = isConnected;
          networkState['network'] = false;
          networkState['latestBlock'] = 0;
          this.setState({ network: networkState });
        }
      }
    });
  }

  initNetwork = (newNetwork) => {
    //checkAccounts();
    const networkState = {...this.state.network};
    networkState['network'] = newNetwork;
    networkState['isConnected'] = true;
    networkState['latestBlock'] = 0;
    this.setState({ network: networkState });

    this.initContracts();
  }

  checkAccounts = () => {
    web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        const networkState = {...this.state.network};
        networkState['accounts'] = accounts;
        networkState['defaultAccount'] = accounts[0];
        this.setState({ network: networkState });
      }
    });
  }

  componentDidMount = () => {
    this.checkNetwork();
    this.checkAccounts();

    this.checkAccountsInterval = setInterval(this.checkAccounts, 10000);
    this.checkNetworkInterval = setInterval(this.checkNetwork, 3000);
  }
  
  loadObject = (abi, address) => {
    return web3.eth.contract(abi).at(address);;
  }

  initContracts = () => {
    const addrs = addresses[this.state.network.network];

    const sai = {...this.state.sai};
    sai['tub'].address = addrs['tub'];
    sai['gem'].address = addrs['gem'];
    sai['skr'].address = addrs['skr'];
    sai['sai'].address = addrs['sai'];
    sai['sin'].address = addrs['sin'];
    sai['pot'].address = addrs['pot'];
    this.setState({ sai });

    window.tubObj = this.tubObj = this.loadObject(tub.abi, addrs['tub']);
    window.gemObj = this.gemObj = this.loadObject(dstoken.abi, addrs['gem']);
    window.skrObj = this.skrObj = this.loadObject(dstoken.abi, addrs['skr']);
    window.saiObj = this.saiObj = this.loadObject(dstoken.abi, addrs['sai']);
    window.sinObj = this.sinObj = this.loadObject(dstoken.abi, addrs['sin']);

    this.getDataFromBlockchain();
    this.getDataFromBlockchainInterval = setInterval(this.getDataFromBlockchain, 10000);
  }

  getDataFromBlockchain = () => {
    this.getTotalSupply('gem');
    this.getTotalSupply('skr');
    this.getTotalSupply('sai');
    this.getTotalSupply('sin');
    this.getBalanceOf('gem', this.state.network.defaultAccount, 'myBalance');
    this.getBalanceOf('gem', this.state.sai.tub.address, 'tubBalance');
    this.getBalanceOf('gem', this.state.sai.pot.address, 'potBalance');
    this.getBalanceOf('skr', this.state.network.defaultAccount, 'myBalance');
    this.getBalanceOf('skr', this.state.sai.tub.address, 'tubBalance');
    this.getBalanceOf('skr', this.state.sai.pot.address, 'potBalance');
    this.getBalanceOf('sai', this.state.network.defaultAccount, 'myBalance');
    this.getBalanceOf('sai', this.state.sai.tub.address, 'tubBalance');
    this.getBalanceOf('sai', this.state.sai.pot.address, 'potBalance');
    this.getBalanceOf('sin', this.state.network.defaultAccount, 'myBalance');
    this.getBalanceOf('sin', this.state.sai.tub.address, 'tubBalance');
    this.getBalanceOf('sin', this.state.sai.pot.address, 'potBalance');

    this.getParameters();

    this.getCups();
  }

  getTotalSupply = (name) => {
    this[`${name}Obj`].totalSupply((e, r) => {
      if (!e) {
        const sai = {...this.state.sai};
        sai[name].totalSupply = r;
        this.setState({ sai });
      }
    })
  }

  getBalanceOf = (name, address, field) => {
    this[`${name}Obj`].balanceOf(address, (e, r) => {
      if (!e) {
        const sai = {...this.state.sai};
        sai[name][field] = r;
        this.setState({ sai });
      }
    })
  }

  getParameters = () => {
    this.tubObj.per((e, per) => {
      if (!e) {
        const sai = {...this.state.sai};
        sai.tub.per = per;
        this.setState({ sai });
      }
    });

    this.tubObj.tag((e, tag) => {
      if (!e) {
        const sai = {...this.state.sai};
        sai.tub.tag = tag;
        this.setState({ sai });
      }
    });

    this.tubObj.axe((e, axe) => {
      if (!e) {
        const sai = {...this.state.sai};
        sai.tub.axe = axe;
        this.setState({ sai });
      }
    });

    this.tubObj.mat((e, mat) => {
      if (!e) {
        const sai = {...this.state.sai};
        sai.tub.mat = mat;
        this.setState({ sai });
      }
    });

    this.tubObj.hat((e, hat) => {
      if (!e) {
        const sai = {...this.state.sai};
        sai.tub.hat = hat;
        this.setState({ sai });
      }
    });
  }
  
  getCups = () => {
    this.tubObj.cupi((e, cupi) => {
      if (!e) {
        for (let i = 1; i <= cupi.toNumber(); i++) {
          this.getCup(i);
        }
      }
    });
  }

  getCup(id) {
    this.tubObj.cups(toBytes32(id), (e, cup) => {
      const sai = {...this.state.sai};
      sai.tub.cups[id] =  {
        owner: cup[0],
        debt: cup[1],
        locked: cup[2],
        safe: 'N/A'
      };
      this.setState({ sai });
      this.tubObj.safe['bytes32'](toBytes32(id), (e, safe) => {
        const sai = {...this.state.sai};
        sai.tub.cups[id]['safe'] = safe;
        this.setState({ sai });
      });
    });
  }

  toNumber = (obj) => {
    return (typeof obj === 'object') ? web3.fromWei(obj.toNumber()) : 0;
  }

  renderTokenRow = (token) => {
    return (
      <tr>
        <td>{ token }</td>
        <td>{ this.toNumber(this.state.sai[token].totalSupply) }</td>
        <td>{ this.toNumber(this.state.sai[token].myBalance) }</td>
        <td>{ this.toNumber(this.state.sai[token].tubBalance) }</td>
        <td>{ this.toNumber(this.state.sai[token].potBalance) }</td>
      </tr>
    )
  }

  renderBiteAction = () => {
    return (
      <span>
        <a href="">Bite</a>/
      </span>
    )
  }

  renderOwnerCupActions = () => {
    return (
      <span>
        <a href="">Join</a>/
        <a href="">Exit</a>/
        <a href="">Lock</a>/
        <a href="">Wipe</a>
      </span>
    )
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>SAI</h2>
        </div>
        <p className="App-intro">
          Simple tool to manage SAI system
        </p>
        <table>
          <thead>
            <tr>
              <th>SKR/ETH</th>
              <th>USD/ETH</th>
              <th>Liq. Ratio</th>
              <th>Liq. Penalty</th>
              <th>Debt Ceiling</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>
                  { this.toNumber(this.state.sai.tub.per) }
                </td>
                <td>
                  { this.toNumber(this.state.sai.tub.tag) }
                </td>
                <td>
                  { this.toNumber(web3.fromWei(this.state.sai.tub.axe)) }
                </td>
                <td>
                  { this.toNumber(web3.fromWei(this.state.sai.tub.mat)) }
                </td>
                <td>
                  { this.toNumber(this.state.sai.tub.hat) }
                </td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>T. Supply</th>
              <th>Mine</th>
              <th>Tub</th>
              <th>Pot</th>
            </tr>
          </thead>
          <tbody>
            { this.renderTokenRow('gem') }
            { this.renderTokenRow('skr') }
            { this.renderTokenRow('sai') }
            { this.renderTokenRow('sin') }
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>Cup</th>
              <th>Owner</th>
              <th>Debt</th>
              <th>Locked</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(this.state.sai.tub.cups).map(key =>
                <tr key={key}>
                  <td>
                    {key}
                  </td>
                  <td>
                    { this.state.sai.tub.cups[key].owner}
                  </td>
                  <td>
                    { this.toNumber(this.state.sai.tub.cups[key].debt) }
                  </td>
                  <td>
                    { this.toNumber(this.state.sai.tub.cups[key].locked) }
                  </td>
                  <td style={this.state.sai.tub.cups[key].safe ? {'backgroundColor':'green'} : {'backgroundColor':'red'} }>
                    {
                      (this.state.sai.tub.cups[key].owner === '0x0000000000000000000000000000000000000000') 
                      ? 'Closed'
                      :
                        (this.state.sai.tub.cups[key].safe === 'N/A') 
                        ? 'N/A' 
                        : (this.state.sai.tub.cups[key].safe ? 'Safe' : 'Unsafe') 
                    }
                  </td>
                  <td>
                    { !this.state.sai.tub.cups[key].safe ? this.renderBiteAction() : '' }
                    { (this.state.sai.tub.cups[key].owner === this.state.network.defaultAccount) ? this.renderOwnerCupActions() : '' }
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
