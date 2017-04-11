import React, { Component } from 'react';
import NoConnection from './NoConnection';
import Modal from './Modal';
import Token from './Token';
import SystemStatus from './SystemStatus';
import Cups from './Cups';
import Transfer from './Transfer';
import web3 from '../web3';
import ReactNotify from '../notify';
import { toBytes32 } from '../helpers';
import logo from '../logo.svg';
import './App.css';


const addresses = require('../config/addresses');

const tub = require('../config/tub');
window.tub = tub;

const dstoken = require('../config/dstoken');
window.dstoken = dstoken;

const dsvault = require('../config/dsvault');
window.dsvault = dsvault;

const dsvalue = require('../config/dsvalue');
window.dsvalue = dsvalue;


class App extends Component {
  state = {
    network: {},
    sai: {
      tub: {
        per: 0,
        tag: 0,
        axe: 0,
        mat: 0,
        hat: 0,
        cups: {}
      },
      gem: {
        totalSupply: 0,
        myBalance: 0,
        tubBalance: 0,
        potBalance: 0,
      },
      skr: {
        totalSupply: 0,
        myBalance: 0,
        tubBalance: 0,
        potBalance: 0,
      },
      sai: {
        totalSupply: 0,
        myBalance: 0,
        tubBalance: 0,
        potBalance: 0,
      },
      sin: {
        totalSupply: 0,
        myBalance: 0,
        tubBalance: 0,
        potBalance: 0,
      },
      pot: {}
    },
    transactions: {},
    modal: {
      show: false
    },
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
    return web3.eth.contract(abi).at(address);
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

    this.getDataFromToken('gem');
    this.getDataFromToken('skr');
    this.getDataFromToken('sai');
    this.getDataFromToken('sin');
    this.getCups(this.state.network.defaultAccount);
    this.getParameters();
    this.getParametersInterval = setInterval(this.getParameters, 10000);

    //Set up filters
    this.setFilterTransfer('gem');
    this.setFilterTransfer('skr');
    this.setFilterTransfer('sai');
    this.setFilterTransfer('sin');
    this.setFiltersTub();
  }

  setFilterTransfer = (token) => {
    this[`${token}Obj`].Transfer({}, {}, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        this.getDataFromToken(token);
      }
    });
  }

  setFiltersTub = () => {
    const cupSignatures = [
      'lock(bytes32,uint128)',
      'free(bytes32,uint128)',
      'draw(bytes32,uint128)',
      'wipe(bytes32,uint128)',
      'bite(bytes32,uint128)',
      'shut(bytes32)',
    ].map((v) => web3.sha3(v).substring(0, 10))

    this.tubObj.LogNote({ guy: this.state.network.defaultAccount }, {}, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (cupSignatures.indexOf(r.args.sig) !== -1) {
          this.getCup(`0x${r.args.fax.substring(10, 74)}`);
        }
      }
    });
  }

  getDataFromToken = (token) => {
    this.getTotalSupply(token);
    this.getBalanceOf(token, this.state.network.defaultAccount, 'myBalance');
    this.getBalanceOf(token, this.state.sai.tub.address, 'tubBalance');
    this.getBalanceOf(token, this.state.sai.pot.address, 'potBalance');
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
    this.getParameterFromTub('per');
    this.getParameterFromTub('tag');
    this.getParameterFromTub('axe');
    this.getParameterFromTub('mat');
    this.getParameterFromTub('hat');
    this.getParameterFromTub('eek');
    this.getParameterFromTub('safe');
  }

  getParameterFromTub = (field) => {
    this.tubObj[field]((e, value) => {
      if (!e) {
        const sai = {...this.state.sai};
        sai.tub[field] = value;
        this.setState({ sai });
      }
    });
  }

  getCups = (address) => {
    this.tubObj.LogNewCup({ lad: address }, { fromBlock: 0 }, (e, r) => {
      if (!e) {
        this.getCup(r.args['cup']);
      }
    });
  }

  getCup(idHex) {
    this.tubObj.cups(idHex, (e, cup) => {
      const id = parseInt(idHex, 16);
      const sai = {...this.state.sai};
      const firstLoad = typeof sai.tub.cups[id] === 'undefined';
      sai.tub.cups[id] =  {
        owner: cup[0],
        debt: cup[1],
        locked: cup[2],
        safe: firstLoad ? 'N/A' : sai.tub.cups[id]['safe']
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
    return (typeof obj === 'object') ? web3.toDecimal(web3.fromWei(obj.toNumber())) : 0;
  }

  handleOpenModal = (e) => {
    e.preventDefault();
    let text = '';
    let type = '';
    const cup = e.target.getAttribute('data-cup') ? e.target.getAttribute('data-cup') : false;

    switch(e.target.getAttribute('data-method')) {
      case 'open':
        text = 'Are you sure you want to open a new Cup?';
        type = 'yesno';
        break;
      case 'shut':
        text = `Are you sure you want to close Cup ${cup}?`;
        type = 'yesno';
        break;
      case 'join':
        text = 'Please set amount of gem (ETH) you want to convert to collateral (SKR)';
        type = 'inputnumber';
        break;
      case 'exit':
        text = 'Please set amount of collateral (SKR) you want to convert to gem (ETH)';
        type = 'inputnumber';
        break;
      case 'lock':
        text = `Please set amount of collateral (SKR) you want to lock in CUP ${cup}`;
        type = 'inputnumber';
        break;
      case 'free':
        text = `Please set amount of collateral (SKR) you want to withdraw from CUP ${cup}`;
        type = 'inputnumber';
        break;
      case 'draw':
        text = `Please set amount of locked collateral (SKR) in CUP ${cup} that you want use to generate SAI`;
        type = 'inputnumber';
        break;
      case 'wipe':
        text = `Please set amount of collateral (SKR) you want to recover burning SAI in CUP ${cup}`;
        type = 'inputnumber';
        break;
      default:
        break;
    }

    this.setState({ modal: { show: true, method: e.target.getAttribute('data-method'), cup, text, type } });
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.setState({ modal: { show: false } });
  }

  logPendingTransaction = (tx) => {
    const msgTemp = 'Transaction TX was created. Waiting for confirmation...';
    const transactions = {...this.state.transactions};
    transactions[tx] = { pending: true }
    this.setState({ transactions });
    console.log(msgTemp.replace('TX', tx))
    this.refs.notificator.info(tx, '', msgTemp.replace('TX', `${tx.substring(0,10)}...`), false);
  }

  logTransactionConfirmed = (tx) => {
    const msgTemp = 'Transaction TX was confirmed.';
    const transactions = {...this.state.transactions};
    if (transactions[tx]) {
      transactions[tx].pending = false;
      this.setState({ transactions });
      console.log(msgTemp.replace('TX', tx))
      this.refs.notificator.success(tx, '', msgTemp.replace('TX', `${tx.substring(0,10)}...`), 4000);
    }
  }

  updateValue = (value) => {
    const method = this.state.modal.method;
    const cup = this.state.modal.cup;

    if (!cup && !value) {
      this.tubObj[method]({ from: this.state.network.defaultAccount, gas: 4000000 }, (e, r) => {
        if (!e) {
          console.log(`${method} executed`);
          this.logPendingTransaction(r);
        } else {
          console.log(e);
        }
      });
    } else if (!cup) {
      this.tubObj[method](web3.toWei(value), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, r) => {
        if (!e) {
          console.log(`${method} ${value} executed`);
          this.logPendingTransaction(r);
        } else {
          console.log(e);
        }
      });
    } else if (!value) {
      this.tubObj[method](toBytes32(cup), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, r) => {
        if (!e) {
          console.log(`${method} ${cup} executed`);
          this.logPendingTransaction(r);
        } else {
          console.log(e);
        }
      });
    } else {
      this.tubObj[method](toBytes32(cup), web3.toWei(value), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, r) => {
        if (!e) {
          console.log(`${method} ${cup} ${value} executed`);
          this.logPendingTransaction(r);
        } else {
          console.log(e);
        }
      });
    }

    this.setState({ modal: { show: false } });
  }

  transferToken = (token, to, amount) => {
    this[`${token}Obj`].transfer(to, web3.toWei(amount), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, r) => {
      if (!e) {
        console.log(`${token} transfer ${to} ${amount}...`);
        this.logPendingTransaction(r);
      } else {
        console.log(e);
      }
    });
  }

  renderMain() {
    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            Sai Explorer
            <small>Version 1.0{/*<button onClick={this.toggle}>Toggle to connect or disconnect</button>*/}</small>
          </h1>
          <ol className="breadcrumb">
            <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
            <li className="active">Dashboard</li>
          </ol>
        </section>
        <section className="content">
          <div>
            <div className="row">
              <Token toNumber={ this.toNumber } sai={ this.state.sai } token='gem' color='' />
              <Token toNumber={ this.toNumber } sai={ this.state.sai } token='skr' color='bg-aqua' />
              <Token toNumber={ this.toNumber } sai={ this.state.sai } token='sai' color='bg-green' />
              <Token toNumber={ this.toNumber } sai={ this.state.sai } token='sin' color='bg-red' />
            </div>
            <div className="row">
              <div className="col-md-9">
                <SystemStatus toNumber={ this.toNumber } sai={ this.state.sai } />
              </div>
              <div className="col-md-3">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">General Actions</h3>
                  </div>
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <a href="#" data-method="join" onClick={ this.handleOpenModal }>Join</a> -&nbsp;
                        <a href="#" data-method="exit" onClick={ this.handleOpenModal }>Exit</a> -&nbsp;
                        <a href="#" data-method="open" onClick={ this.handleOpenModal }>Open</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-9">
                <Cups toNumber={ this.toNumber } sai={ this.state.sai } network={ this.state.network } handleOpenModal={ this.handleOpenModal } />
              </div>
              <div className="col-md-3">
                <Transfer transferToken={ this.transferToken }/>
              </div>
            </div>
          </div>
          <Modal modal={ this.state.modal } updateValue={ this.updateValue } handleCloseModal={ this.handleCloseModal } />
          <ReactNotify ref='notificator'/>
        </section>
      </div>
    );
  }

  render() {
    return (
      this.state.network.isConnected ? this.renderMain() : <NoConnection />
    );
  }
}

export default App;
