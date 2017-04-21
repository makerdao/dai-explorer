import React, { Component } from 'react';
import NoConnection from './NoConnection';
import Modal from './Modal';
import Token from './Token';
import SystemStatus from './SystemStatus';
import Cups from './Cups';
import Transfer from './Transfer';
import web3, { initWeb3 } from  '../web3';
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
    params: ''
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
    setTimeout(this.init, 500);
  }

  init = () => {
    initWeb3(web3);

    this.checkNetwork();
    this.checkAccounts();

    const params = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
    this.setState({ params });

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

    this.setFiltersTub(this.state.params && this.state.params[0] && this.state.params[0] === 'all' ? false : this.state.network.defaultAccount);

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
        this.setFilterToken(token);
      }
    })
  }

  setFilterToken = (token) => {
    const filters = ['Transfer', 'Deposit', 'Withdraw'];

    for (let i = 0; i < filters.length; i++) {
      if (this[`${token}Obj`][filters[i]]) {
        this[`${token}Obj`][filters[i]]({}, {}, (e, r) => {
          if (!e) {
            this.logTransactionConfirmed(r.transactionHash);
            this.getDataFromToken(token);
          }
        });
      }
    }
  }

  setFiltersTub = (address) => {
    // Get open cups by address (or all)
    
    let conditions = {};
    if (address) {
      conditions = { lad: address }
    }
    this.tubObj.LogNewCup(conditions, { fromBlock: 0 }, (e, r) => {
      if (!e) {
        this.getCup(r.args['cup'], address);
      }
    });
    if (address) {
      // Get cups given to address (only if not seeing all cups).
      this.tubObj.LogNote({ sig: this.methodSig('give(bytes32,address)'), bar: toBytes32(address) }, { fromBlock: 0 }, (e, r) => {
        if (!e) {
          this.getCup(r.args.foo, address);
        }
      });
    }

    const cupSignatures = [
      'lock(bytes32,uint128)',
      'free(bytes32,uint128)',
      'draw(bytes32,uint128)',
      'wipe(bytes32,uint128)',
      'bite(bytes32)',
      'shut(bytes32)',
      'bail(bytes32)',
      'give(bytes32,address)',
    ].map((v) => this.methodSig(v))

    if (address) {
      conditions = { guy: address }
    }

    this.tubObj.LogNote(conditions, {}, (e, r) => {
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
    if (token === 'sai' || token === 'sin') {
      this.getBoomBustValues();
    }
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
    this.getParameterFromTub('off');
    this.getParameterFromTub('per');
    this.getParameterFromTub('tag');
    this.getParameterFromTub('axe');
    this.getParameterFromTub('mat');
    this.getParameterFromTub('hat');
    this.getParameterFromTub('eek');
    this.getParameterFromTub('safe');
    this.getParameterFromTub('fix');
    this.getParameterFromTub('fit');
  }

  getParameterFromTub = (field) => {
    this.tubObj[field]((e, value) => {
      if (!e) {
        const sai = { ...this.state.sai };
        sai.tub[field] = value;
        this.setState({ sai });

        this.getBoomBustValues();

        Object.keys(sai.tub.cups).map(key =>
          this.updateCup(key)
        );
      }
    });
  }

  getBoomBustValues = () => {
    if (this.state.sai.sai.tubBalance && this.state.sai.sin.tubBalance) {
      const sai = { ...this.state.sai };
      const dif = this.state.sai.sai.tubBalance.minus(this.state.sai.sin.tubBalance);
      sai.tub.avail_boom_sai = web3.toBigNumber(0);
      sai.tub.avail_bust_sai = web3.toBigNumber(0);
      if (dif.gt(0)) {
        sai.tub.avail_boom_sai = dif;
      } else if (dif.lt(0)) {
        sai.tub.avail_bust_sai = dif.abs();
      }
      sai.tub.avail_boom_skr = sai.tub.avail_boom_sai.times(this.state.sai.tub.per).div(this.state.sai.tub.tag);
      sai.tub.avail_bust_skr = sai.tub.avail_bust_sai.times(this.state.sai.tub.per).div(this.state.sai.tub.tag);
      this.setState({ sai });
    }
  }

  getCup(idHex, address) {
    this.tubObj.cups(idHex, (e, cup) => {
      const id = parseInt(idHex, 16);
      const sai = { ...this.state.sai };
      const firstLoad = typeof sai.tub.cups[id] === 'undefined';
      if (!address || address === cup[0]) {
        // This verification needs to be done as the cup could have been given or closed by the user
        sai.tub.cups[id] =  {
          lad: cup[0],
          art: cup[1],
          ink: cup[2],
          safe: firstLoad ? 'N/A' : sai.tub.cups[id]['safe']
        };
        this.setState({ sai });
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
    sai.tub.cups[id].pro = cup.ink.div(sai.tub.per).times((sai.tub.tag));
    sai.tub.cups[id].avail_sai = sai.tub.cups[id].pro.div(web3.fromWei(web3.fromWei(sai.tub.mat))).minus(cup.art);
    sai.tub.cups[id].avail_skr = cup.ink.minus(cup.art.times(sai.tub.per).div(sai.tub.tag).times(web3.fromWei(web3.fromWei(sai.tub.mat))));
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
        if (c.method === 'tubCashAllowanceSKR') {
          this.tubCashAllowanceSKR();
        } else {
          if (c.cup && c.value) {
            this.executeMethodCupValue(c.method, c.cup, c.value);
          } else if (c.value) {
            this.executeMethodValue(c.method, c.value);
          } else if (c.cup) {
            this.executeMethodCup(c.method, c.cup);
          } else {
            this.executeMethod(c.method);
          }
        }
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

  executeMethodCupValue = (method, cup, value, toWei = true) => {
    this.tubObj[method](toBytes32(cup), toWei ? web3.toWei(value) : value, { from: this.state.network.defaultAccount, gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `tub: ${method} ${value}`);
      } else {
        console.log(e);
      }
    });
  }

  tubAllowance = (token, method, cup, value, value2 = false) => {
    this[`${token}Obj`].allowance(this.state.network.defaultAccount, this.tubObj.address, (e, r) => {
      if (!e) {
        const valueAllowance = value2 ? value2 : value;
        const valueObj = web3.toBigNumber(web3.toWei(valueAllowance));
        if (r.lt(valueObj)) {
          this[`${token}Obj`].approve(this.tubObj.address, web3.toWei(valueAllowance), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, tx) => {
            this.logPendingTransaction(tx, `${token}: approve tub ${valueAllowance}`, { method, cup, value  });
          });
        } else {
          cup ? this.executeMethodCupValue(method, cup, value) : this.executeMethodValue(method, value);
        }
      }
    });
  }

  tubCashAllowanceSAI = () => {
    if (this.state.sai.sai.myBalance.gt(0)) {
      this.saiObj.allowance(this.state.network.defaultAccount, this.tubObj.address, (e, r) => {
        if (!e) {
          if (r.lt(this.state.sai.sai.myBalance)) {
            this.saiObj.approve(this.tubObj.address, this.state.sai.sai.myBalance, { from: this.state.network.defaultAccount, gas: 4000000 }, (e, tx) => {
              this.logPendingTransaction(tx, `sai: approve tub ${web3.fromWei(this.state.sai.sai.myBalance)}`, { method: 'tubCashAllowanceSKR' });
            });
          } else {
            this.tubCashAllowanceSKR();
          }
        }
      });
    } else {
      this.tubCashAllowanceSKR();
    }
  }

  tubCashAllowanceSKR = () => {
    if (this.state.sai.skr.myBalance.gt(0)) {
      this.skrObj.allowance(this.state.network.defaultAccount, this.tubObj.address, (e, r) => {
        if (!e) {
          if (r.lt(this.state.sai.skr.myBalance)) {
            this.skrObj.approve(this.tubObj.address, this.state.sai.skr.myBalance, { from: this.state.network.defaultAccount, gas: 4000000 }, (e, tx) => {
              this.logPendingTransaction(tx, `skr: approve tub ${web3.fromWei(this.state.sai.skr.myBalance)}`, { method: 'cash' });
            });
          } else {
            this.executeMethod('cash');
          }
        }
      });
    } else {
      this.executeMethod('cash');
    }
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
      case 'bite':
      case 'bail':
        this.executeMethodCup(method, cup);
        break;
      case 'join':
        if (this.state.sai.gem.myBalance.lt(valueWei)) {
          error = `Not enough balance to join ${value} GEM.`;
        } else {
          this.tubAllowance('gem', method, false, value);
        }
        break;
      case 'exit':
        if (this.state.sai.skr.myBalance.lt(valueWei)) {
          error = `Not enough balance to exit ${value} SKR.`;
        } else {
          this.tubAllowance('skr', method, false, value);
        }
        break;
      case 'boom':
        if (this.state.sai.tub.avail_boom_skr.lt(valueWei)) {
          error = `Not enough SKR in the system to boom ${value} SKR.`;
        } if (this.state.sai.skr.myBalance.lt(valueWei)) {
          error = `Not enough balance of SKR to boom ${value} SKR.`;
        } else {
          this.tubAllowance('skr', method, false, value);
        }
        break;
      case 'bust':
        const valueSAI = web3.toBigNumber(value).times(this.state.sai.tub.tag).div(this.state.sai.tub.per);
        const valueSAIWei = web3.toBigNumber(web3.toWei(valueSAI));
        if (this.state.sai.tub.avail_bust_sai.lt(valueSAIWei)) {
          error = `Not enough SAI in the system to bust ${value} SKR.`;
        } else if (this.state.sai.sai.myBalance.lt(valueSAIWei)) {
          error = `Not enough balance of SAI to bust ${value} SKR.`;
        } else {
          this.tubAllowance('sai', method, false, value, valueSAI);
        }
        break;
      case 'lock':
        if (this.state.sai.skr.myBalance.lt(valueWei)) {
          error = `Not enough balance to lock ${value} SKR.`;
        } else {
          this.tubAllowance('skr', method, cup, value);
        }
        break;
      case 'free':
        if (this.state.sai.tub.cups[cup].avail_skr.lt(valueWei)) {
          error = `${value} SKR exceeds the maximum available to free.`;
        } else {
          this.executeMethodCupValue(method, cup, value);
        }
        break;
      case 'draw':
        if (this.state.sai.sin.totalSupply.add(valueWei).gt(this.state.sai.tub.hat)) {
          error = `${value} SAI exceeds the system deb ceiling.`;
        } else if (this.state.sai.tub.cups[cup].avail_sai.lt(valueWei)) {
          error = `${value} SAI exceeds the maximum available to draw.`;
        } else {
          this.executeMethodCupValue(method, cup, value);
        }
        break;
      case 'wipe':
        if (this.state.sai.sai.myBalance.lt(valueWei)) {
          error = `Not enough balance to wipe ${value} SAI.`;
        } else if(this.state.sai.tub.cups[cup].art.lt(valueWei)) {
          error = `Debt in CUP ${cup} is lower than ${value} SAI.`;
        } else {
          this.tubAllowance('sai', method, cup, value);
        }
        break;
      case 'give':
        this.executeMethodCupValue(method, cup, value, false);
        break;
      case 'cash':
        this.tubCashAllowanceSAI();
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
    const actions = [];
    if (this.state.sai.tub.off && this.state.sai.sai.myBalance && this.state.sai.skr.myBalance
        && (this.state.sai.sai.myBalance.gt(0) || this.state.sai.skr.myBalance.gt(0))) {
      actions.push('cash');
    } else if(this.state.sai.tub.off === false) {
      actions.push('open');
      if (this.state.sai.gem.myBalance && this.state.sai.gem.myBalance.gt(0)) {
        actions.push('join');
      }
      if (this.state.sai.skr.myBalance && this.state.sai.skr.myBalance.gt(0)) {
        actions.push('exit');
      }
      if (this.state.sai.tub.avail_boom_sai && this.state.sai.tub.avail_boom_sai.gt(0)) {
        actions.push('boom');
      }
      if (this.state.sai.tub.avail_bust_sai && this.state.sai.tub.avail_bust_sai.gt(0)) {
        actions.push('bust');
      }
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
                <Cups toNumber={ this.toNumber } sai={ this.state.sai } network={ this.state.network } handleOpenModal={ this.handleOpenModal } all={ this.state.params && this.state.params[0] && this.state.params[0] === 'all' } />
              </div>
              <div className="col-md-3">
                <Transfer transferToken={ this.transferToken } sai={ this.state.sai } />
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
