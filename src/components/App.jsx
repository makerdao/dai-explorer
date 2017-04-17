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
// import logo from '../logo.svg';
import './App.css';


const addresses = require('../config/addresses');

const tub = require('../config/tub');
window.tub = tub;

const dstoken = require('../config/dstoken');
window.dstoken = dstoken;

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
            const networkState = { ...this.state.network };
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
          const networkState = { ...this.state.network };
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
    const networkState = { ...this.state.network };
    networkState['network'] = newNetwork;
    networkState['isConnected'] = true;
    networkState['latestBlock'] = 0;
    this.setState({ network: networkState });

    this.initContracts();
  }

  checkAccounts = () => {
    web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        const networkState = { ...this.state.network };
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

    const sai = { ...this.state.sai };
    sai['tub'].address = addrs['tub'];
    this.setState({ sai });

    window.tubObj = this.tubObj = this.loadObject(tub.abi, addrs['tub']);
    this.getParameters();
    this.getParametersInterval = setInterval(this.getParameters, 10000);

    this.setUpPot();
    this.setUpToken('gem');
    this.setUpToken('skr');
    this.setUpToken('sai');
    this.setUpToken('sin');

    this.setFiltersTub(this.state.network.defaultAccount);

    // This is necessary to finish transactions that failed after signing
    this.checkPendingTransactionsInterval = setInterval(this.checkPendingTransactions, 10000);
  }

  setUpPot = () => {
    this.tubObj.pot((e, r) => {
      if (!e) {
        const sai = { ...this.state.sai };
        sai.pot.address = r;
        this.setState({ sai });
      }
    })
  }

  setUpToken = (token) => {
    this.tubObj[token]((e, r) => {
      if (!e) {
        window[`${token}Obj`] = this[`${token}Obj`] = this.loadObject(dstoken.abi, r);

        const sai = { ...this.state.sai };
        sai[token].address = r;
        this.setState({ sai });

        this.getDataFromToken(token);
        this.setFilterTransfer(token);
      }
    })
  }

  setFilterTransfer = (token) => {
    this[`${token}Obj`].Transfer({}, {}, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        this.getDataFromToken(token);
      }
    });
  }

  setFiltersTub = (address) => {
    // Get open cups by address
    this.tubObj.LogNewCup({ lad: address }, { fromBlock: 0 }, (e, r) => {
      if (!e) {
        this.getCup(r.args['cup'], address);
      }
    });
    // Get cups given to address.
    this.tubObj.LogNote({ sig: this.methodSig('give(bytes32,address)'), bar: toBytes32(address) }, { fromBlock: 0 }, (e, r) => {
      if (!e) {
        this.getCup(r.args.foo, address);
      }
    });

    const cupSignatures = [
      'lock(bytes32,uint128)',
      'free(bytes32,uint128)',
      'draw(bytes32,uint128)',
      'wipe(bytes32,uint128)',
      'bite(bytes32,uint128)',
      'shut(bytes32)',
      'give(bytes32,address)',
    ].map((v) => this.methodSig(v))

    this.tubObj.LogNote({ guy: address }, {}, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (cupSignatures.indexOf(r.args.sig) !== -1) {
          this.getCup(r.args.foo, address);
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
        const sai = { ...this.state.sai };
        sai[name].totalSupply = r;
        this.setState({ sai });
      }
    })
  }

  getBalanceOf = (name, address, field) => {
    this[`${name}Obj`].balanceOf(address, (e, r) => {
      if (!e) {
        const sai = { ...this.state.sai };
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
        const sai = { ...this.state.sai };
        sai.tub[field] = value;
        this.setState({ sai });

        Object.keys(sai.tub.cups).map(key =>
          this.updateCup(key)
        )
      }
    });
  }

  getCup(idHex, address) {
    this.tubObj.cups(idHex, (e, cup) => {
      const id = parseInt(idHex, 16);
      const sai = { ...this.state.sai };
      const firstLoad = typeof sai.tub.cups[id] === 'undefined';
      if (address === cup[0]) {
        // This verification needs to be done as the cup could have been given or closed by the user
        sai.tub.cups[id] =  {
          owner: cup[0],
          debt: cup[1],
          locked: cup[2],
          safe: firstLoad ? 'N/A' : sai.tub.cups[id]['safe']
        };
        this.setState({ sai });
        this.tubObj.safe['bytes32'](toBytes32(id), (e, safe) => {
          if (!e) {
            const sai = { ...this.state.sai };
            if (sai.tub.cups[id]) {
              sai.tub.cups[id]['safe'] = safe;
              this.setState({ sai });
            }
          }
        });
        this.updateCup(id);
      } else if(!firstLoad) {
        // This means was already in the collection but the user doesn't own it anymore (used 'give' or 'shut')
        delete sai.tub.cups[id];
      }
    });
  }

  updateCup = (id) => {
    const sai = { ...this.state.sai };
    const cup = sai.tub.cups[id];
    sai.tub.cups[id].pro = cup.locked.div(sai.tub.per).times((sai.tub.tag));
    sai.tub.cups[id].avail_sai = sai.tub.cups[id].pro.div(web3.fromWei(web3.fromWei(sai.tub.mat))).minus(cup.debt);
    sai.tub.cups[id].avail_skr = cup.locked.minus(cup.debt.times(sai.tub.per).div(sai.tub.tag).times(web3.fromWei(web3.fromWei(sai.tub.mat))));
    this.setState({ sai });
  }

  methodSig = (method) => {
    return web3.sha3(method).substring(0, 10)
  }

  toNumber = (obj) => {
    return (typeof obj === 'object') ? web3.toDecimal(web3.fromWei(obj)) : 0;
  }

  handleOpenModal = (e) => {
    e.preventDefault();
    const method = e.target.getAttribute('data-method');
    const cup = e.target.getAttribute('data-cup') ? e.target.getAttribute('data-cup') : false;
    this.setState({ modal: { show: true, method, cup } });
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.setState({ modal: { show: false } });
  }

  checkPendingTransactions = () => {
    const transactions = { ...this.state.transactions };
    Object.keys(transactions).map(tx => {
      if (transactions[tx].pending) {
        web3.eth.getTransactionReceipt(tx, (e, r) => {
          if (!e && r !== null) {
            if (r.logs.length > 0) {
              this.logTransactionConfirmed(tx);
            } else {
              this.logTransactionFailed(tx);
            }
          }
        });
      }
      return false;
    });
  }

  logPendingTransaction = (tx, title, callback = {}) => {
    const msgTemp = 'Transaction TX was created. Waiting for confirmation...';
    const transactions = { ...this.state.transactions };
    transactions[tx] = { pending: true, title, callback }
    this.setState({ transactions });
    console.log(msgTemp.replace('TX', tx))
    this.refs.notificator.info(tx, title, msgTemp.replace('TX', `${tx.substring(0,10)}...`), false);
  }

  logTransactionConfirmed = (tx) => {
    const msgTemp = 'Transaction TX was confirmed.';
    const transactions = { ...this.state.transactions };
    if (transactions[tx]) {
      transactions[tx].pending = false;
      this.setState({ transactions });

      this.refs.notificator.success(tx, transactions[tx].title, msgTemp.replace('TX', `${tx.substring(0,10)}...`), 4000);

      const c = transactions[tx].callback;
      if (c.method) {
        c.cup ? this.executeMethodCupValue(c.method, c.cup, c.value) : this.executeMethodValue(c.method, c.value);
      }
    }
  }

  logTransactionFailed = (tx) => {
    const msgTemp = 'Transaction TX failed.';
    const transactions = { ...this.state.transactions };
    if (transactions[tx]) {
      transactions[tx].pending = false;
      this.setState({ transactions });
      this.refs.notificator.error(tx, transactions[tx].title, msgTemp.replace('TX', `${tx.substring(0,10)}...`), 4000);
    }
  }

  executeMethod = (method) => {
    this.tubObj[method]({ from: this.state.network.defaultAccount, gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `tub: ${method}`);
      } else {
        console.log(e);
      }
    });
  }

  executeMethodCup = (method, cup) => {
    this.tubObj[method](toBytes32(cup), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `tub: ${method} ${cup}`);
      } else {
        console.log(e);
      }
    });
  }

  executeMethodValue = (method, value) => {
    this.tubObj[method](web3.toWei(value), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `tub: ${method} ${value}`);
      } else {
        console.log(e);
      }
    });
  }

  executeMethodCupValue = (method, cup, value) => {
    this.tubObj[method](toBytes32(cup), web3.toWei(value), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `tub: ${method} ${value}`);
      } else {
        console.log(e);
      }
    });
  }

  tubAllowance = (token, method, cup, value) => {
    this[`${token}Obj`].allowance(this.state.network.defaultAccount, this.tubObj.address, (e, r) => {
      if (!e) {
        const valueObj = web3.toBigNumber(web3.toWei(value));
        if (r.lt(valueObj)) {
          this[`${token}Obj`].approve(this.tubObj.address, web3.toWei(value), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, tx) => {
            this.logPendingTransaction(tx, `${token}: approve tub ${value}`, { method, cup, value  });
          });
        } else {
          cup ? this.executeMethodCupValue(method, cup, value) : this.executeMethodValue(method, value);
        }
      }
    });
  }


  updateValue = (value) => {
    const method = this.state.modal.method;
    const cup = this.state.modal.cup;
    const valueWei = web3.toWei(value);
    let error = false;

    switch(method) {
      case 'open':
        this.executeMethod(method);
        break;
      case 'shut':
        this.executeMethodCup(method, cup);
        break;
      case 'join':
        if (this.state.sai.gem.myBalance.gte(valueWei)) {
          this.tubAllowance('gem', method, false, value);
        } else {
          error = `Not enough balance to join ${value} GEM.`;
        }
        break;
      case 'exit':
        if (this.state.sai.skr.myBalance.gte(valueWei)) {
          this.tubAllowance('skr', method, false, value);
        } else {
          error = `Not enough balance to exit ${value} SKR.`;
        }
        break;
      case 'lock':
        if (this.state.sai.skr.myBalance.gte(valueWei)) {
          this.tubAllowance('skr', method, cup, value);
        } else {
          error = `Not enough balance to lock ${value} SKR.`;
        }
        break;
      case 'free':
        if (this.state.sai.tub.cups[cup].avail_skr.gte(valueWei)) {
          this.executeMethodCupValue(method, cup, value);
        } else {
          error = `${value} SKR exceeds the maximum available to free.`;
        }
        break;
      case 'draw':
        if(this.state.sai.sin.totalSupply.add(valueWei).gt(this.state.sai.tub.hat)) {
          error = `${value} SAI exceeds the system deb ceiling.`;
        } else if (this.state.sai.tub.cups[cup].avail_sai.lt(valueWei)) {
          error = `${value} SAI exceeds the maximum available to draw.`;
        } else {
          this.executeMethodCupValue(method, cup, value);
        }
        break;
      case 'wipe':
        if(this.state.sai.sai.myBalance.lt(valueWei)) {
          error = `Not enough balance to wipe ${value} SAI.`;
        } else if(this.state.sai.tub.cups[cup].debt.lt(valueWei)) {
          error = `Debt in CUP ${cup} is lower than ${value} SAI.`;
        } else {
          this.tubAllowance('sai', method, cup, value);
        }
        break;
      case 'give':
        this.executeMethodCupValue(method, cup, value);
        break;
      default:
        break;
    }

    if (error) {
      const modal = { ...this.state.modal }
      modal.error = error;
      this.setState({ modal });
    } else {
      this.setState({ modal: { show: false } });
    }
  }

  transferToken = (token, to, amount) => {
    this[`${token}Obj`].transfer(to, web3.toWei(amount), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `${token}: transfer ${to} ${amount}`);
      } else {
        console.log(e);
      }
    });
  }

  renderMain() {
    const actions = ['open'];
    if (this.state.sai.gem.myBalance.valueOf() !== '0') {
      actions.push('join');
    }
    if (this.state.sai.skr.myBalance.valueOf() !== '0') {
      actions.push('exit');
    }
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
                        {
                          Object.keys(actions).map(key =>
                            <span key={ key }><a href="#" data-method={ actions[key] } onClick={ this.handleOpenModal }>{ actions[key] }</a> / </span>
                          )
                        }
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
