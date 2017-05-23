import React, { Component } from 'react';
import NoConnection from './NoConnection';
import Modal from './Modal';
import Token from './Token';
import GeneralInfo from './GeneralInfo';
import Faucet from './Faucet';
import SystemStatus from './SystemStatus';
import Cups from './Cups';
import Transfer from './Transfer';
import Tag from './Tag';
import Lpc from './Lpc';
import web3, { initWeb3 } from  '../web3';
import ReactNotify from '../notify';
import { toBytes32, fromRaytoWad } from '../helpers';
// import logo from '../logo.svg';
import './App.css';

const addresses = require('../config/addresses');

const tub = require('../config/tub');
window.tub = tub;

const dstoken = require('../config/dstoken');
window.dstoken = dstoken;

const dsvalue = require('../config/dsvalue');
window.dsvalue = dsvalue;

const dsroles = require('../config/dsroles');
window.dsroles = dsroles;

const lpc = require('../config/sailpc');
window.lpc = lpc;

class App extends Component {
  constructor() {
    super();
    const initialState = this.getInitialState();
    this.state = {
      ...initialState,
      network: {},
      transactions: {},
      modal: {
        show: false
      },
      params: ''
    }
  }

  getInitialState = () => {
    return {
      sai: {
        tub: {
          address: null,
          authority: null,
          role: 'undefined',
          eek: 'undefined',
          safe: 'undefined',
          reg: web3.toBigNumber(-1),
          per: web3.toBigNumber(-1),
          tag: web3.toBigNumber(-1),
          axe: web3.toBigNumber(-1),
          mat: web3.toBigNumber(-1),
          hat: web3.toBigNumber(-1),
          fix: web3.toBigNumber(-1),
          par: web3.toBigNumber(-1),
          cage_price: web3.toBigNumber(-1),
          cups: {}
        },
        gem: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          tubBalance: web3.toBigNumber(-1),
          potBalance: web3.toBigNumber(-1),
          lpcBalance: web3.toBigNumber(-1),
        },
        skr: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          tubBalance: web3.toBigNumber(-1),
          potBalance: web3.toBigNumber(-1),
        },
        sai: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          tubBalance: web3.toBigNumber(-1),
          potBalance: web3.toBigNumber(-1),
          lpcBalance: web3.toBigNumber(-1),
        },
        sin: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          tubBalance: web3.toBigNumber(-1),
          potBalance: web3.toBigNumber(-1),
        },
        pot: {
          address: null,
        },
        tag: {
          address: null,
        },
        lpc: {
          address: null,
        },
        lps: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
        }
      },
    };
  }

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

    const addrs = addresses[this.state.network.network];

    this.initContracts(addrs['tub'], addrs['lpc']);
  }

  checkAccounts = () => {
    web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        const networkState = { ...this.state.network };
        networkState['accounts'] = accounts;
        networkState['defaultAccount'] = accounts[0];
        web3.eth.defaultAccount = networkState['defaultAccount'];
        this.setState({ network: networkState }, () => this.checkUserAuth());
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

  validateContracts = (tubAddress, lpcAddress) => {
    return web3.isAddress(tubAddress) && web3.isAddress(lpcAddress);
  }

  initContracts = (tubAddress, lpcAddress) => {
    if (!this.validateContracts(tubAddress, lpcAddress)) {
      return;
    }
    web3.reset(true);
    const initialState = this.getInitialState();
    this.setState({
      ...initialState
    }, () => {

      const sai = { ...this.state.sai };

      sai['tub'].address = tubAddress;
      sai['lpc'].address = lpcAddress;
      this.setState({ sai });

      window.tubObj = this.tubObj = this.loadObject(tub.abi, sai.tub.address);
      window.lpcObj = this.lpcObj = this.loadObject(lpc.abi, sai.lpc.address);

      this.initializeSystemStatus();

      this.setUpPot();
      this.setUpLPS();
      this.setUpToken('gem');
      this.setUpToken('skr');
      this.setUpToken('sai');
      this.setUpToken('sin');

      this.setFiltersTub(this.state.params && this.state.params[0] && this.state.params[0] === 'all' ? false : this.state.network.defaultAccount);

      this.setFilterTag();

      // This is necessary to finish transactions that failed after signing
      this.checkPendingTransactionsInterval = setInterval(this.checkPendingTransactions, 10000);
    });
  }

  loadRoles = (value) => {
    this.tubObj.authority((e, r) => {
      window.rolesObj = this.rolesObj = this.loadObject(dsroles.abi, r);
      this.checkUserAuth();
    });
  }

  checkUserAuth = () => {
    if (this.state.network && this.state.network.defaultAccount !== null && typeof this.rolesObj !== 'undefined') {
      this.rolesObj.isUserRoot(this.state.network.defaultAccount, (e, r) => {
        const sai = { ...this.state.sai };
        if (!e) {
          if (r) {
            sai.tub.role = 'root';
            this.setState({ sai });
          } else {
             this.rolesObj.hasUserRole(this.state.network.defaultAccount, 1, (e2, r2) => {
               if (!e2) {
                sai.tub.role = r2 ? 'user' : 'none';
                this.setState({ sai });
               }
             });
          }
        }
      })
    }
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

  setUpLPS = () => {
    this.lpcObj.lps((e, r) => {
      if (!e) {
        const sai = { ...this.state.sai };
        sai.lps.address = r;
        window.lpsObj = this.lpsObj = this.loadObject(dstoken.abi, sai.lps.address);
        this.setState({ sai }, () => {
          this.getDataFromToken('lps');
          this.setFilterToken('lps');
        });
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
    const filters = ['Transfer', 'LogNoteMint', 'LogNoteBurn'];

    if (token === 'gem') {
      filters.push('Deposit');
      filters.push('Withdraw');
    }

    for (let i = 0; i < filters.length; i++) {
      const conditions = {};
      if (filters[i] === 'LogNoteMint') {
        conditions.sig = this.methodSig('mint(uint128)');
        filters[i] = 'LogNote';
      }
      if (filters[i] === 'LogNoteBurn') {
        conditions.sig = this.methodSig('burn(uint128)');
        filters[i] = 'LogNote';
      }
      if (this[`${token}Obj`][filters[i]]) {
        this[`${token}Obj`][filters[i]](conditions, {}, (e, r) => {
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
    this.tubObj.LogNewCup(conditions, { fromBlock: addresses[this.state.network.network]['fromBlock'] }, (e, r) => {
      if (!e) {
        this.getCup(r.args['cup'], address);
      }
    });
    if (address) {
      // Get cups given to address (only if not seeing all cups).
      this.tubObj.LogNote({ sig: this.methodSig('give(bytes32,address)'), bar: toBytes32(address) }, { fromBlock: addresses[this.state.network.network]['fromBlock'] }, (e, r) => {
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
    ].map((v) => this.methodSig(v));

    if (address) {
      conditions = { guy: address }
    }

    this.tubObj.LogNote(conditions, {}, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (cupSignatures.indexOf(r.args.sig) !== -1) {
          this.getCup(r.args.foo, address);
        } else if (r.args.sig === this.methodSig('cage(uint128)')) {
          this.getParameterFromTub('reg');
          this.getParameterFromTub('fix', true);
          this.getParameterFromTub('par', true);
        } else if (r.args.sig === this.methodSig('chop(uint128)')) {
          this.getParameterFromTub('axe', true);
        } else if (r.args.sig === this.methodSig('cuff(uint128)')) {
          this.getParameterFromTub('mat', true);
        } else if (r.args.sig === this.methodSig('cork(uint128)')) {
          this.getParameterFromTub('hat');
        } else if (r.args.sig === this.methodSig('vent()')) {
          this.getParameterFromTub('reg');
        }
      }
    });
  }

  setFilterTag = () => {
    this.tubObj.tip((e, r) => {
      if (!e) {
        window.tagObj = this.tagObj = this.loadObject(dsvalue.abi, r);
        const sai = { ...this.state.sai };
        sai.tag.address = r;
        this.setState({ sai });
        this.tagObj.LogNote({}, {}, (e, r) => {
          if (!e) {
            if (
              r.args.sig === this.methodSig('poke(bytes32)') ||
              r.args.sig === this.methodSig('poke()')
            ) {
              this.getParameterFromTub('tag');
            }
          }
        });
      }
    })
  }

  getDataFromToken = (token) => {
    this.getTotalSupply(token);
    this.getBalanceOf(token, this.state.network.defaultAccount, 'myBalance');

    if (token !== 'lps') {
      this.getBalanceOf(token, this.state.sai.tub.address, 'tubBalance');
      this.getBalanceOf(token, this.state.sai.pot.address, 'potBalance');
      this.getParameterFromLPC('pie');
      this.getParameterFromLPC('gap');
      this.getParameterFromLPC('per', true);
    }
    if (token === 'sai' || token === 'gem') {
      this.getBalanceOf(token, this.state.sai.lpc.address, 'lpcBalance');
    }
    if (token === 'sai' || token === 'sin') {
      this.getBoomBustValues();
    }
    if (token === 'gem' || token === 'skr') {
      this.getParameterFromTub('per', true);
    }
  }

  getTotalSupply = (name) => {
    this[`${name}Obj`].totalSupply((e, r) => {
      if (!e) {
        const sai = { ...this.state.sai };
        sai[name].totalSupply = r;
        this.setState({ sai }, () => {
          if (name === 'sin') {
            this.calculateSafetyAndDeficit();
          }
        });
      }
    })
  }

  getBalanceOf = (name, address, field) => {
    this[`${name}Obj`].balanceOf(address, (e, r) => {
      if (!e) {
        const sai = { ...this.state.sai };
        sai[name][field] = r;
        this.setState({ sai }, () => {
          if (name === 'skr' && field === 'potBalance') {
            this.calculateSafetyAndDeficit();
          }
        });
      }
    })
  }

  initializeSystemStatus = () => {
    this.getParameterFromTub('authority', false, this.loadRoles());
    this.getParameterFromTub('reg', false, this.getCagePriceFromTub);
    this.getParameterFromTub('per', true);
    this.getParameterFromTub('tag', false, this.calculateSafetyAndDeficit);
    this.getParameterFromTub('axe', true);
    this.getParameterFromTub('mat', true, this.calculateSafetyAndDeficit);
    this.getParameterFromTub('hat');
    this.getParameterFromTub('fix', true);
    this.getParameterFromTub('par', true);
    this.getParameterFromLPC('pie');
    this.getParameterFromLPC('gap');
    this.getParameterFromLPC('per', true, this.calculateSafetyAndDeficit);
  }

  calculateSafetyAndDeficit = () => {
    if (this.state.sai.skr.potBalance.gte(0) && this.state.sai.tub.per.gte(0)
        && this.state.sai.tub.tag.gte(0) && this.state.sai.sin.totalSupply.gte(0)) {
      const jam = this.state.sai.skr.potBalance.times(this.state.sai.tub.per).div(web3.toBigNumber(10).pow(18));
      const pro = jam.times(this.state.sai.tub.tag).div(web3.toBigNumber(10).pow(18));
      const con = this.state.sai.sin.totalSupply;

      const sai = { ...this.state.sai };
      sai.tub.eek = pro.lt(con);

      if (this.state.sai.tub.mat.gte(0)) {
        const min = con.times(this.state.sai.tub.mat).div(web3.toBigNumber(10).pow(18));
        sai.tub.safe = pro.gte(min);
      }
      this.setState({ sai });
    }
  }

  getParameterFromTub = (field, ray = false, callback = false) => {
    this.tubObj[field]((e, value) => {
      if (!e) {
        const sai = { ...this.state.sai };
        sai.tub[field] = ray ? fromRaytoWad(value) : value;
        this.setState({ sai }, () => {
          this.getBoomBustValues();

          Object.keys(sai.tub.cups).map(key =>
            this.updateCup(key)
          );

          if (callback) {
            callback(value);
          }
        });
      }
    });
  }

  getParameterFromLPC = (field, ray = false) => {
    this.lpcObj[field]((e, value) => {
      if (!e) {
        const sai = { ...this.state.sai };
        sai.lpc[field] = ray ? fromRaytoWad(value) : value;
        this.setState({ sai });
      }
    });
  }

  getCagePriceFromTub = (reg) => {
    if (reg.gt(0)) {
      this.tubObj.LogNote({ sig: this.methodSig('cage(uint128)') }, { fromBlock: addresses[this.state.network.network]['fromBlock'] }, (e, r) => {
        if (!e) {
          const sai = { ...this.state.sai };
          sai.tub['cage_price'] = web3.toBigNumber(r.args.foo);
          this.setState({ sai });
        }
      });
    }
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
      sai.tub.avail_boom_skr = sai.tub.avail_boom_sai.times(web3.toBigNumber(10).pow(36)).div(this.state.sai.tub.per.times(this.state.sai.tub.tag));
      sai.tub.avail_bust_skr = sai.tub.avail_bust_sai.times(web3.toBigNumber(10).pow(36)).div(this.state.sai.tub.per.times(this.state.sai.tub.tag));
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
    sai.tub.cups[id].pro = cup.ink.times(sai.tub.per).times(sai.tub.tag).div(web3.toBigNumber(10).pow(36));
    sai.tub.cups[id].ratio = cup.pro.div(cup.art);
    sai.tub.cups[id].avail_sai = sai.tub.cups[id].pro.div(web3.fromWei(sai.tub.mat)).minus(cup.art);
    sai.tub.cups[id].avail_skr = cup.ink.minus(cup.art.times(sai.tub.mat).times(web3.toBigNumber(10).pow(18)).div(sai.tub.per.times(sai.tub.tag)));
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
        if(c.method.indexOf('lpc-') !== -1) {
          this.executeLPCMethod(c.method, c.token, c.value);
        } else if (c.cup && c.value) {
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
    this.tubObj[method]({ gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `tub: ${method}`);
      } else {
        console.log(e);
      }
    });
  }

  executeMethodCup = (method, cup) => {
    this.tubObj[method](toBytes32(cup), { gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `tub: ${method} ${cup}`);
      } else {
        console.log(e);
      }
    });
  }

  executeMethodValue = (method, value) => {
    this.tubObj[method](web3.toWei(value), { gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `tub: ${method} ${value}`);
      } else {
        console.log(e);
      }
    });
  }

  executeMethodCupValue = (method, cup, value, toWei = true) => {
    this.tubObj[method](toBytes32(cup), toWei ? web3.toWei(value) : value, { gas: 4000000 }, (e, tx) => {
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
          this[`${token}Obj`].approve(this.tubObj.address, web3.toWei(valueAllowance), { gas: 4000000 }, (e, tx) => {
            if (!e) {
              this.logPendingTransaction(tx, `${token}: approve tub ${valueAllowance}`, { method, cup, value  });
            } else {
              console.log(e);
            }
          });
        } else {
          cup ? this.executeMethodCupValue(method, cup, value) : this.executeMethodValue(method, value);
        }
      }
    });
  }

  executeLPCMethod = (method, token, value) => {
    const cleanMethod = method.replace('lpc-', '');
    this.lpcObj[cleanMethod](this.state.sai[token].address, web3.toWei(value), { gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `lpc: ${cleanMethod} ${token} ${value}`);
      } else {
        console.log(e);
      }
    });
  }

  lpcAllowance = (tokenMethod, tokenAllowance, method, value, valueAllowance) => {
    this[`${tokenAllowance}Obj`].allowance(this.state.network.defaultAccount, this.lpcObj.address, (e, r) => {
      if (!e) {
        const valueObj = web3.toBigNumber(valueAllowance);
        if (r.lt(valueObj)) {
          this[`${tokenAllowance}Obj`].approve(this.lpcObj.address, valueAllowance, { gas: 4000000 }, (e, tx) => {
            if (!e) {
              this.logPendingTransaction(tx, `${tokenAllowance}: approve lpc ${web3.fromWei(valueAllowance)}`, { method, token: tokenMethod, value });
            } else {
              console.log(e);
            }
          });
        } else {
          this.executeLPCMethod(method, tokenMethod, value);
        }
      }
    });
  }

  updateValue = (value, token) => {
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
        if (this.state.sai.tub.reg.eq(1)) {
          error = 'Exit can not be executed in this system state.';
        } else if (this.state.sai.tub.reg.eq(2)) {
          this.tubAllowance('skr', method, false, web3.fromWei(this.state.sai.skr.myBalance));
        } else {
          if (this.state.sai.skr.myBalance.lt(valueWei)) {
            error = `Not enough balance to exit ${value} SKR.`;
          } else {
            this.tubAllowance('skr', method, false, value);
          }
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
        const valueSAI = web3.toBigNumber(value).times(this.state.sai.tub.tag).times(this.state.sai.tub.per).div(web3.toBigNumber(10).pow(36));
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
        this.tubAllowance('sai', method, false, web3.fromWei(this.state.sai.sai.myBalance));
        break;
      case 'lpc-pool':
        if (token === 'sai' && this.state.sai.sai.myBalance.lt(valueWei)) {
          error = `Not enough balance to pool ${value} SAI.`;
        } else if (token === 'gem' && this.state.sai.gem.myBalance.lt(valueWei)) {
          error = `Not enough balance to pool ${value} GEM.`;
        } else {
          this.lpcAllowance(token, token, method, value, web3.toWei(value));
        }
        break;
      case 'lpc-exit':
        if (token === 'gem' && this.state.sai.gem.lpcBalance.lt(web3.toWei(value))) {
          error = `Not enough funds in LPC to exit ${value} GEM.`;
        } else if (token === 'sai' && this.state.sai.sai.lpcBalance.lt(web3.toWei(value))) {
          error = `Not enough funds in LPC to exit ${value} SAI.`;
        } else {
          let lpsEq = null;
          if (token === 'gem') {
            lpsEq = web3.toBigNumber(value).times(this.state.sai.tub.tag).times(this.state.sai.lpc.per).div(web3.toBigNumber(10).pow(18)).round(0);
          } else {
            lpsEq = web3.toBigNumber(value).times(this.state.sai.lpc.per).round(0);
          }
          if (lpsEq.lt(this.state.sai.lpc.pie)) {
            lpsEq = lpsEq.times(this.state.sai.lpc.gap).div(web3.toBigNumber(10).pow(18));
          }

          if (this.state.sai.lps.myBalance.lt(lpsEq)) {
            error = `Not enough balance in LPS to exit ${value} TOKEN.`.replace('TOKEN', token.toUpperCase());
          } else {
            this.lpcAllowance(token, 'lps', method, value, lpsEq.ceil());
          }
        }
        break;
      case 'lpc-take':
        if (token === 'gem' && this.state.sai.gem.lpcBalance.lt(web3.toWei(value))) {
          error = `Not enough balance in LPC to take ${value} GEM.`;
        } else if (token === 'sai' && this.state.sai.sai.lpcBalance.lt(web3.toWei(value))) {
          error = `Not enough balance in LPC to take ${value} SAI.`;
        } else {
          if (token === 'gem') {
            const valueSai = web3.toBigNumber(value).times(this.state.sai.tub.tag).times(this.state.sai.lpc.gap).div(web3.toBigNumber(10).pow(18));
            if (this.state.sai.sai.myBalance.lt(valueSai)) {
              error = `Not enough balance in SAI to take ${value} GEM.`;
            } else {
              this.lpcAllowance(token, 'sai', method, value, valueSai.ceil());
            }
          } else if (token === 'sai') {
            const valueGem = web3.toBigNumber(value).times(this.state.sai.lpc.gap).times(web3.toBigNumber(10).pow(18)).div(this.state.sai.tub.tag);
            if (this.state.sai.gem.myBalance.lt(valueGem)) {
              error = `Not enough balance in GEM to take ${value} SAI.`;
            } else {
              this.lpcAllowance(token, 'gem', method, value, valueGem.ceil());
            }
          }
        }
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
    this[`${token}Obj`].transfer(to, web3.toWei(amount), { gas: 4000000 }, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `${token}: transfer ${to} ${amount}`);
      } else {
        console.log(e);
      }
    });
  }

  isUser = () => {
    return ['root', 'user'].indexOf(this.state.sai.tub.role) !== -1;
  }

  renderMain() {
    const actions = {
      cash: this.isUser() && this.state.sai.tub.reg.gt(0) && this.state.sai.sai.myBalance.gt(0),
      open: this.isUser() && this.state.sai.tub.reg.eq(0),
      join: this.isUser() && this.state.sai.tub.reg.eq(0) && this.state.sai.gem.myBalance.gt(0),
      exit: this.isUser() && this.state.sai.skr.myBalance.gt(0),
      boom: this.isUser() && this.state.sai.tub.reg.eq(0) && this.state.sai.tub.avail_boom_sai && this.state.sai.tub.avail_boom_sai.gt(0),
      bust: this.isUser() && this.state.sai.tub.reg.eq(0) && this.state.sai.tub.avail_bust_sai && this.state.sai.tub.avail_bust_sai.gt(0)
    };

    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            Sai Explorer
            <small>Version 1.0{/*<button onClick={this.toggle}>Toggle to connect or disconnect</button>*/}</small>
          </h1>
          <ol className="breadcrumb">
            <li><a href="#action"><i className="fa fa-dashboard"></i> Home</a></li>
            <li className="active">Dashboard</li>
          </ol>
        </section>
        <section className="content">
          <div>
            <div className="row">
              <div className="col-md-12">
                <GeneralInfo tub={ this.state.sai.tub.address } lpc={ this.state.sai.lpc.address } network={ this.state.network.network } account={ this.state.network.defaultAccount } role={ this.state.sai.tub.role }
                  initContracts={this.initContracts} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-9">
                <div className="row">
                  <Token sai={ this.state.sai } token='gem' color='' />
                  <Token sai={ this.state.sai } token='skr' color='bg-aqua' />
                  <Token sai={ this.state.sai } token='sai' color='bg-green' />
                  <Token sai={ this.state.sai } token='sin' color='bg-red' />
                  <Token sai={ this.state.sai } token='lps' color='bg-blue' />
                </div>
                <SystemStatus sai={ this.state.sai } />
                <Cups sai={ this.state.sai } network={ this.state.network } handleOpenModal={ this.handleOpenModal } all={ this.state.params && this.state.params[0] && this.state.params[0] === 'all' } />
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
                            <span key={ key }>
                              { actions[key] ? <a href="#action" data-method={ key } onClick={ this.handleOpenModal }>{ key }</a> : key }
                              <span> / </span>
                            </span>
                          )
                        }
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          { this.state.network.network === 'kovan' && <Faucet account={ this.state.network.defaultAccount } gem={ this.state.sai.gem.address } /> }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Lpc state={ this.state } isUser={ this.isUser } handleOpenModal={ this.handleOpenModal } />
                {
                  this.state.sai.tag.address && this.state.network.network !== 'private' &&
                  <Tag address={ this.state.sai.tag.address } tag={ this.state.sai.tub.tag } />
                }
                <Transfer transferToken={ this.transferToken } sai={ this.state.sai } />
              </div>
            </div>
          </div>
          <Modal modal={ this.state.modal } updateValue={ this.updateValue } handleCloseModal={ this.handleCloseModal } reg={ this.state.sai.tub.reg } />
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
