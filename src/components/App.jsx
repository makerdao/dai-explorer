import React, { Component } from 'react';
import NoConnection from './NoConnection';
import Modal from './Modal';
import Token from './Token';
import GeneralInfo from './GeneralInfo';
import Faucet from './Faucet';
import SystemStatus from './SystemStatus';
import Cups from './Cups';
import Transfer from './Transfer';
import FeedValue from './FeedValue';
import Lpc from './Lpc';
import web3, { initWeb3 } from  '../web3';
import ReactNotify from '../notify';
import { WAD, toBytes32, fromRaytoWad, wmul, wdiv, etherscanTx } from '../helpers';
// import logo from '../logo.svg';
import './App.css';

const addresses = require('../config/addresses');

const tub = require('../config/tub');
const jar = require('../config/saijar');
const top = require('../config/top');
const tap = require('../config/tap');
const tip = require('../config/tip');
const dstoken = require('../config/dstoken');
const dsvalue = require('../config/dsvalue');
const dsroles = require('../config/dsroles');
const lpc = require('../config/sailpc');

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
          axe: web3.toBigNumber(-1),
          mat: web3.toBigNumber(-1),
          hat: web3.toBigNumber(-1),
          fit: web3.toBigNumber(-1),
          tax: web3.toBigNumber(-1),
          chi: web3.toBigNumber(-1),
          rho: web3.toBigNumber(-1),
          cups: {},
        },
        jar: {
          address: null,
          per: web3.toBigNumber(-1),
          tag: web3.toBigNumber(-1),
          gap: web3.toBigNumber(-1),
        },
        top: {
          address: null,
        },
        tap: {
          address: null,
          gap: web3.toBigNumber(-1),
        },
        tip: {
          address: null,
          era: web3.toBigNumber(-1),
          tau: web3.toBigNumber(-1),
          par: web3.toBigNumber(-1),
          way: web3.toBigNumber(-1),
        },
        gem: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          jarBalance: web3.toBigNumber(-1),
          pitBalance: web3.toBigNumber(-1),
          lpcBalance: web3.toBigNumber(-1),
        },
        skr: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          jarBalance: web3.toBigNumber(-1),
          pitBalance: web3.toBigNumber(-1),
        },
        sai: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          pitBalance: web3.toBigNumber(-1),
          lpcBalance: web3.toBigNumber(-1),
        },
        sin: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          potBalance: web3.toBigNumber(-1),
          pitBalance: web3.toBigNumber(-1),
          // This field will keep an estimated value of new sin which is being generated due the 'stability/issuer fee'.
          // It will return to zero each time 'drip' is called
          issuerFee: web3.toBigNumber(0),
        },
        pot: {
          address: null,
        },
        pit: {
          address: null,
        },
        pip: {
          address: null,
          val: web3.toBigNumber(-1),
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

    this.initContracts(addrs['tub'], addrs['tap'], addrs['top'], addrs['lpc']);
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

    this.setHashParams();
    window.onhashchange = () => {
      this.setHashParams();
      this.initContracts(this.state.sai.tub.address, this.state.sai.tap.address, this.state.sai.top.address, this.state.sai.lpc.address);
    }

    this.checkAccountsInterval = setInterval(this.checkAccounts, 10000);
    this.checkNetworkInterval = setInterval(this.checkNetwork, 3000);
  }

  setHashParams = () => {
    const params = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
    this.setState({ params });
  }

  loadObject = (abi, address) => {
    return web3.eth.contract(abi).at(address);
  }

  validateAddresses = (tubAddress, tapAddress, topAddress, lpcAddress) => {
    return web3.isAddress(tubAddress) && web3.isAddress(tapAddress) && web3.isAddress(topAddress) && web3.isAddress(lpcAddress);
  }

  initContracts = (tubAddress, tapAddress, topAddress, lpcAddress) => {
    if (!this.validateAddresses(tubAddress, tapAddress, topAddress, lpcAddress)) {
      return;
    }
    web3.reset(true);
    const initialState = this.getInitialState();
    this.setState({
      ...initialState
    }, () => {
      // We need to verify that tap and top correspond to the tub
      const setUpPromises = [this.getTubAddress(tap.abi, tapAddress), this.getTubAddress(top.abi, topAddress)];
      Promise.all(setUpPromises).then((r) => {
        if (r[1] === r[0] && r[0] === tubAddress) {
          window.tubObj = this.tubObj = this.loadObject(tub.abi, tubAddress);
          window.tapObj = this.tapObj = this.loadObject(tap.abi, tapAddress);
          window.topObj = this.topObj = this.loadObject(top.abi, topAddress);
          window.lpcObj = this.lpcObj = this.loadObject(lpc.abi, lpcAddress);

          const sai = { ...this.state.sai };

          sai['tub'].address = tubAddress;
          sai['top'].address = topAddress;
          sai['tap'].address = tapAddress;
          sai['lpc'].address = lpcAddress;
          this.setState({ sai });

          const promises = [this.setUpJar(), this.setUpTip()];

          Promise.all(promises).then((r) => {
            this.initializeSystemStatus();

            this.setUpPot();
            this.setUpPit();
            this.setUpLPS();
            this.setUpToken('gem');
            this.setUpToken('skr');
            this.setUpToken('sai');
            this.setUpToken('sin');

            this.setFiltersTub(this.state.params && this.state.params[0] && this.state.params[0] === 'all' ? false : this.state.network.defaultAccount);
            this.setFiltersTap();
            this.setFiltersTip();
            this.setFiltersJar();
            this.setFiltersLpc();
            this.setFilterFeedValue();
            this.setTimeVariablesInterval();

            // This is necessary to finish transactions that failed after signing
            this.checkPendingTransactionsInterval = setInterval(this.checkPendingTransactions, 10000);
          });
        }
      });
    });
  }

  loadEraRho = () => {
    const promises = [
                      this.getParameterFromTub('rho'),
                      this.getParameterFromTip('era')
                      ];
    Promise.all(promises).then((r) => {
      if (r[0] === true && r[1] === true && this.state.sai.tub.tax.gte(0) && this.state.sai.sin.potBalance.gte(0)) {
        const sai = { ...this.state.sai };
        sai.sin.issuerFee = this.state.sai.sin.potBalance.times(web3.fromWei(this.state.sai.tub.tax).pow(this.state.sai.tip.era.minus(this.state.sai.tub.rho))).minus(this.state.sai.sin.potBalance).round(0);
        this.setState({ sai });
      }
    });
  }

  setTimeVariablesInterval = () => {
    setInterval(() => {
      this.getParameterFromTub('chi', true);
      this.getParameterFromTip('par');
      this.getParameterFromLpc('per', true);
      this.loadEraRho();
    }, 5000);
  }

  loadRoles = (value) => {
    this.tubObj.authority((e, r) => {
      window.rolesObj = this.rolesObj = this.loadObject(dsroles.abi, r);
      this.checkUserAuth();
    });
  }

  checkUserAuth = () => {
    if (this.state.network && this.state.network.defaultAccount !== null && typeof this.rolesObj !== 'undefined') {
      this.rolesObj.isUserRoot.call(this.state.network.defaultAccount, (e, r) => {
        const sai = { ...this.state.sai };
        if (!e) {
          if (r) {
            sai.tub.role = 'root';
            this.setState({ sai });
          } else {
             this.rolesObj.hasUserRole.call(this.state.network.defaultAccount, 1, (e2, r2) => {
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

  getTubAddress = (abi, address) => {
    const p = new Promise((resolve, reject) => {
      this.loadObject(abi, address).tub.call((e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  setUpJar = () => {
    const p = new Promise((resolve, reject) => {
      this.tubObj.jar((e, r) => {
        if (!e) {
          const sai = { ...this.state.sai };
          sai.jar.address = r;
          window.jarObj = this.jarObj = this.loadObject(jar.abi, r);
          this.setState({ sai }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  setUpTip = () => {
    const p = new Promise((resolve, reject) => {
      this.tubObj.tip((e, r) => {
        if (!e) {
          const sai = { ...this.state.sai };
          sai.tip.address = r;
          window.tipObj = this.tipObj = this.loadObject(tip.abi, r);
          this.setState({ sai }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  setUpPot = (object) => {
    this.tubObj.pot((e, r) => {
      if (!e) {
        const sai = { ...this.state.sai };
        sai.pot.address = r;
        this.setState({ sai });
      }
    })
  }

  setUpPit = (object) => {
    this.tubObj.pit((e, r) => {
      if (!e) {
        const sai = { ...this.state.sai };
        sai.pit.address = r;
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

    this.tubObj.LogNote({}, {}, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (cupSignatures.indexOf(r.args.sig) !== -1) {
          this.getCup(r.args.foo, address);
        } else if (r.args.sig === this.methodSig('cage()')) {
          this.getParameterFromTub('reg');
          this.getParameterFromTub('fit');
        } else if (r.args.sig === this.methodSig('chop(uint128)')) {
          this.getParameterFromTub('axe', true);
        } else if (r.args.sig === this.methodSig('cuff(uint128)')) {
          this.getParameterFromTub('mat', true);
        } else if (r.args.sig === this.methodSig('cork(uint128)')) {
          this.getParameterFromTub('hat');
        } else if (r.args.sig === this.methodSig('vent()')) {
          this.getParameterFromTub('reg');
        } else if (r.args.sig === this.methodSig('crop(uint128)') || r.args.sig === this.methodSig('warp(uint64)') || r.args.sig === this.methodSig('drip()')) {
          if (r.args.sig === this.methodSig('crop(uint128)')) {
            this.getParameterFromTub('tax', true);
          }
          this.getParameterFromTub('chi', true);
          this.loadEraRho();
        }
      }
    });
  }

  setFiltersTap = () => {
    this.tapObj.LogNote({}, {}, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('jump(uint128)')) {
          this.getParameterFromTap('gap', false, this.getBoomBustValues());
        }
      }
    });
  }

  setFiltersTip = () => {
    this.tipObj.LogNote({}, {}, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('coax(uint128)')) {
          this.getParameterFromTip('way', true);
        }
      }
    });
  }

  setFiltersJar = () => {
    this.jarObj.LogNote({}, {}, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('jump(uint128)')) {
          this.getParameterFromJar('gap');
        }
      }
    });
  }

  setFiltersLpc = () => {
    this.lpcObj.LogNote({}, {}, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('jump(uint128)')) {
          this.getParameterFromLpc('gap');
        }
      }
    });
  }

  setFilterFeedValue = () => {
    this.jarObj.pip.call((e, r) => {
      if (!e) {
        window.pipObj = this.pipObj = this.loadObject(dsvalue.abi, r);
        const sai = { ...this.state.sai };
        sai.pip.address = r;
        this.setState({ sai }, () => {
          this.getValFromPip();
        });
        this.pipObj.LogNote({}, {}, (e, r) => {
          if (!e) {
            if (
              r.args.sig === this.methodSig('poke(bytes32)') ||
              r.args.sig === this.methodSig('poke()')
            ) {
              this.getParameterFromJar('tag');
              this.getValFromPip();
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
      this.getParameterFromLpc('pie');
      this.getParameterFromLpc('gap');
      this.getParameterFromLpc('per', true);
    }
    if (token === 'sin') {
      this.getBalanceOf(token, this.state.sai.pot.address, 'potBalance');
    }
    if (token === 'gem' || token === 'skr') {
      this.getBalanceOf(token, this.state.sai.jar.address, 'jarBalance');
    }
    if (token === 'sai' || token === 'gem') {
      this.getBalanceOf(token, this.state.sai.lpc.address, 'lpcBalance');
    }
    if (token === 'gem' || token === 'skr' || token === 'sai' || token === 'sin') {
      this.getBalanceOf(token, this.state.sai.pit.address, 'pitBalance');
      this.getBoomBustValues();
    }
    if (token === 'gem' || token === 'skr') {
      this.getParameterFromJar('per', true);
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
    this.getParameterFromTub('reg', false);
    this.getParameterFromTub('axe', true);
    this.getParameterFromTub('mat', true, this.calculateSafetyAndDeficit);
    this.getParameterFromTub('hat');
    this.getParameterFromTub('fit');
    this.getParameterFromTub('tax', true);
    this.getParameterFromTub('chi', true);
    this.getParameterFromJar('per', true);
    this.getParameterFromJar('gap');
    this.getParameterFromJar('tag', false, this.calculateSafetyAndDeficit);
    this.getParameterFromTap('gap', false, this.getBoomBustValues());
    this.getParameterFromTip('way', true);
    this.getParameterFromTip('par');
    this.loadEraRho();
    this.getParameterFromLpc('pie');
    this.getParameterFromLpc('gap');
    this.getParameterFromLpc('per', true, this.calculateSafetyAndDeficit);
  }

  calculateSafetyAndDeficit = () => {
    if (this.state.sai.skr.jarBalance.gte(0) && this.state.sai.jar.tag.gte(0) && this.state.sai.sin.totalSupply.gte(0)) {
      const pro = wmul(this.state.sai.skr.jarBalance, this.state.sai.jar.tag);
      const con = this.state.sai.sin.totalSupply;

      const sai = { ...this.state.sai };
      sai.tub.eek = pro.lt(con);

      if (this.state.sai.tub.mat.gte(0)) {
        const min = wmul(con, this.state.sai.tub.mat);
        sai.tub.safe = pro.gte(min);
      }
      this.setState({ sai });
    }
  }

  getParameterFromTub = (field, ray = false, callback = false) => {
    const p = new Promise((resolve, reject) => {
      this.tubObj[field].call((e, value) => {
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

            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getParameterFromJar = (field, ray = false, callback = false) => {
    const p = new Promise((resolve, reject) => {
      this.jarObj[field].call((e, value) => {
        if (!e) {
          const sai = { ...this.state.sai };
          sai.jar[field] = ray ? fromRaytoWad(value) : value;
          this.setState({ sai }, () => {
            this.getBoomBustValues();
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getParameterFromTap = (field, ray = false) => {
    const p = new Promise((resolve, reject) => {
      this.tapObj[field].call((e, value) => {
        if (!e) {
          const sai = { ...this.state.sai };
          sai.tap[field] = ray ? fromRaytoWad(value) : value;
          this.setState({ sai }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getParameterFromTip = (field, ray = false) => {
    const p = new Promise((resolve, reject) => {
      this.tipObj[field].call((e, value) => {
        if (!e) {
          const sai = { ...this.state.sai };
          sai.tip[field] = ray ? fromRaytoWad(value) : value;
          this.setState({ sai }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getParameterFromLpc = (field, ray = false) => {
    this.lpcObj[field].call((e, value) => {
      if (!e) {
        const sai = { ...this.state.sai };
        sai.lpc[field] = ray ? fromRaytoWad(value) : value;
        this.setState({ sai });
      }
    });
  }

  getValFromPip = (field) => {
    const p = new Promise((resolve, reject) => {
      this.pipObj.read.call((e, value) => {
        if (!e) {
          const sai = { ...this.state.sai };
          sai.pip.val = web3.toBigNumber(parseInt(value, 16));
          this.setState({ sai }, () => {
            this.getBoomBustValues();
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getBoomBustValues = () => {
    if (this.state.sai.sai.pitBalance && this.state.sai.sin.pitBalance && this.state.sai.pip.val) {
      const sai = { ...this.state.sai };
      const dif = sai.sai.pitBalance.add(sai.sin.issuerFee).minus(sai.sin.pitBalance);
      sai.tub.avail_boom_sai = web3.toBigNumber(0);
      sai.tub.avail_bust_sai = web3.toBigNumber(0);

      if (dif.gt(0)) {
        sai.tub.avail_boom_sai = dif;
      } else if (dif.lt(0)) {
        // This is a margin we need to take into account as bust quantity goes down per second
        const futureFee = sai.sin.potBalance.times(web3.fromWei(sai.tub.tax).pow(120)).minus(sai.sin.potBalance).round(0);
        sai.tub.avail_bust_sai = dif.abs().minus(futureFee);
      }
      sai.tub.avail_boom_skr = wdiv(wdiv(wmul(sai.tub.avail_boom_sai, sai.tip.par), sai.jar.tag), WAD.minus(sai.tap.gap));
      sai.tub.avail_bust_skr = wdiv(wdiv(wmul(sai.tub.avail_bust_sai, sai.tip.par), sai.jar.tag), WAD.add(sai.tap.gap));

      if (sai.tub.avail_bust_sai.gt(0) && sai.skr.pitBalance.lt(sai.tub.avail_bust_skr)) {
        // We need to consider the case where SKR needs to be minted generating a change in 'sai.jar.tag'
        sai.tub.avail_bust_skr = wdiv(sai.skr.totalSupply.minus(sai.skr.pitBalance), wdiv(wmul(wmul(sai.pip.val, WAD.add(sai.tap.gap)), sai.gem.jarBalance), wmul(sai.tub.avail_bust_sai, sai.tip.par)).minus(WAD));
      }
      this.setState({ sai });
    }
  }

  getCup = (idHex, address) => {
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

  tab = (art) => {
    return wmul(art, this.state.sai.tub.chi).round(0);
  }

  updateCup = (id) => {
    const sai = { ...this.state.sai };
    const cup = sai.tub.cups[id];
    sai.tub.cups[id].pro = wmul(cup.ink, sai.jar.tag).round(0);
    sai.tub.cups[id].ratio = cup.pro.div(wmul(this.tab(cup.art), sai.tip.par));
    // This is to give a window margin to get the maximum value (as 'chi' is dynamic value per second)
    const marginTax = web3.fromWei(this.state.sai.tub.tax).pow(120);
    sai.tub.cups[id].avail_sai = wdiv(cup.pro, wmul(sai.tub.mat, sai.tip.par)).minus(this.tab(cup.art)).round(0).minus(1); // "minus(1)" to avoid rounding issues when dividing by mat (in the contract uses it multiplying on safe function)
    sai.tub.cups[id].avail_sai_with_margin = wdiv(cup.pro, wmul(sai.tub.mat, sai.tip.par)).minus(this.tab(cup.art).times(marginTax)).round(0).minus(1);
    sai.tub.cups[id].avail_skr = cup.ink.minus(wdiv(wmul(wmul(this.tab(cup.art), sai.tub.mat), sai.tip.par), sai.jar.tag)).round(0);
    sai.tub.cups[id].avail_skr_with_margin = cup.ink.minus(wdiv(wmul(wmul(this.tab(cup.art).times(marginTax), sai.tub.mat), sai.tip.par), sai.jar.tag)).round(0);
    sai.tub.cups[id].liq_price = cup.ink.gt(0) && cup.art.gt(0) ? wdiv(wdiv(wmul(this.tab(cup.art), sai.tub.mat), sai.jar.per), cup.ink) : web3.toBigNumber(0);

    this.setState({ sai }, () => {
      this.tubObj.safe['bytes32'](toBytes32(id), (e, safe) => {
        if (!e) {
          const sai = { ...this.state.sai };
          if (sai.tub.cups[id]) {
            sai.tub.cups[id]['safe'] = safe;
            this.setState({ sai });
          }
        }
      });
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
    this.refs.notificator.info(tx, title, etherscanTx(this.state.network.network, msgTemp.replace('TX', `${tx.substring(0,10)}...`), tx), false);
  }

  logTransactionConfirmed = (tx) => {
    const msgTemp = 'Transaction TX was confirmed.';
    const transactions = { ...this.state.transactions };
    if (transactions[tx]) {
      transactions[tx].pending = false;
      this.setState({ transactions });

      this.refs.notificator.success(tx, transactions[tx].title, etherscanTx(this.state.network.network, msgTemp.replace('TX', `${tx.substring(0,10)}...`), tx), 4000);

      const c = transactions[tx].callback;
      if (c.method) {
        if(c.method.indexOf('lpc-') !== -1) {
          this.executeLpcMethod(c.method, c.token, c.value);
        } else if (c.method === 'shut') {
          this.executeMethodCup(c.method, c.cup)
        } else if (c.cup && c.value) {
          this.executeMethodCupValue(c.method, c.cup, c.value);
        } else if (c.value) {
          this.executeMethodValue((c.method === 'bust' || c.method === 'boom') ? 'tap' : 'tub', c.method, c.value);
        } else if (c.cup) {
          this.executeMethodCup(c.method, c.cup);
        } else {
          this.executeMethod(c.method === 'cash' ? 'top' : 'tub', c.method);
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

  executeMethod = (object, method) => {
    this[`${object}Obj`][method]({}, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `${object}: ${method}`);
      } else {
        console.log(e);
      }
    });
  }

  executeMethodCup = (method, cup) => {
    this.tubObj[method](toBytes32(cup), {}, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `tub: ${method} ${cup}`);
      } else {
        console.log(e);
      }
    });
  }

  executeMethodValue = (object, method, value) => {
    this[`${object}Obj`][method](web3.toWei(value), {}, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `${object}: ${method} ${value}`);
      } else {
        console.log(e);
      }
    });
  }

  executeMethodCupValue = (method, cup, value, toWei = true) => {
    this.tubObj[method](toBytes32(cup), toWei ? web3.toWei(value) : value, {}, (e, tx) => {
      if (!e) {
        this.logPendingTransaction(tx, `tub: ${method} ${cup} ${value}`);
      } else {
        console.log(e);
      }
    });
  }

  pitAllowance = (token, method, value, value2 = false) => {
    this[`${token}Obj`].allowance(this.state.network.defaultAccount, this.state.sai.pit.address, (e, r) => {
      if (!e) {
        const valueAllowance = value2 ? value2 : value;
        const valueObj = web3.toBigNumber(web3.toWei(valueAllowance));
        if (r.lt(valueObj)) {
          this[`${token}Obj`].approve(this.state.sai.pit.address, web3.toWei(valueAllowance), {}, (e, tx) => {
            if (!e) {
              value = method === 'cash' ? false : value;
              this.logPendingTransaction(tx, `${token}: approve pit ${valueAllowance}`, { method, value });
            } else {
              console.log(e);
            }
          });
        } else {
          method === 'cash' ? this.executeMethod('top', method) : this.executeMethodValue('tap', method, value);
        }
      }
    });
  }

  jarAllowance = (token, method, cup, value) => {
    this[`${token}Obj`].allowance(this.state.network.defaultAccount, this.jarObj.address, (e, r) => {
      if (!e) {
        const valueObj = web3.toBigNumber(web3.toWei(value));
        if (r.lt(valueObj)) {
          this[`${token}Obj`].approve(this.jarObj.address, web3.toWei(value), {}, (e, tx) => {
            if (!e) {
              this.logPendingTransaction(tx, `${token}: approve jar ${value}`, { method, cup, value });
            } else {
              console.log(e);
            }
          });
        } else {
          cup ? this.executeMethodCupValue(method, cup, value) : this.executeMethodValue('tub', method, value);
        }
      }
    });
  }

  potAllowance = (token, method, cup, value) => {
    this[`${token}Obj`].allowance(this.state.network.defaultAccount, this.state.sai.pot.address, (e, r) => {
      if (!e) {
        const valueObj = web3.toBigNumber(web3.toWei(value));
        if (r.lt(valueObj)) {
          this[`${token}Obj`].approve(this.state.sai.pot.address, web3.toWei(value), {}, (e, tx) => {
            if (!e) {
              this.logPendingTransaction(tx, `${token}: approve pot ${value}`, { method, cup, value });
            } else {
              console.log(e);
            }
          });
        } else {
          this.executeMethodCupValue(method, cup, value);
        }
      }
    });
  }

  executeLpcMethod = (method, token, value) => {
    const cleanMethod = method.replace('lpc-', '');
    this.lpcObj[cleanMethod](this.state.sai[token].address, web3.toWei(value), {}, (e, tx) => {
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
          this[`${tokenAllowance}Obj`].approve(this.lpcObj.address, valueAllowance, {}, (e, tx) => {
            if (!e) {
              this.logPendingTransaction(tx, `${tokenAllowance}: approve lpc ${web3.fromWei(valueAllowance)}`, { method, token: tokenMethod, value });
            } else {
              console.log(e);
            }
          });
        } else {
          this.executeLpcMethod(method, tokenMethod, value);
        }
      }
    });
  }

  updateValue = (value, token) => {
    const method = this.state.modal.method;
    const cup = this.state.modal.cup;
    let error = false;
    switch(method) {
      case 'open':
        this.executeMethod('tub', method);
        break;
      case 'shut':
        // We calculate debt with some margin before shutting cup (to avoid failures)
        const debt = this.tab(this.state.sai.tub.cups[cup].art).times(web3.fromWei(this.state.sai.tub.tax).pow(120));
        if (this.state.sai.sai.myBalance.lt(debt)) {
          error = `Not enough balance of SAI to shut CUP ${cup}.`;
        } else {
          this.potAllowance('sai', method, cup, web3.fromWei(debt));
        }
        break;
      case 'bite':
      case 'bail':
        this.executeMethodCup(method, cup);
        break;
      case 'join':
        this.jarAllowance('gem', method, false, value);
        break;
      case 'exit':
        if (this.state.sai.tub.reg.eq(1)) {
          this.jarAllowance('skr', method, false, web3.fromWei(this.state.sai.skr.myBalance));
        } else if (this.state.sai.tub.reg.eq(0)) {
          this.jarAllowance('skr', method, false, value);
        }
        break;
      case 'boom':
        this.pitAllowance('skr', method, value);
        break;
      case 'bust':
        const valueSAI = wmul(wdiv(wmul(web3.toBigNumber(value), this.state.sai.jar.tag), this.state.sai.tip.par), WAD.add(this.state.sai.tap.gap)).ceil();
        this.pitAllowance('sai', method, value, valueSAI);
        break;
      case 'lock':
        this.jarAllowance('skr', method, cup, value);
        break;
      case 'free':
      case 'draw':
        this.executeMethodCupValue(method, cup, value);
        break;
      case 'wipe':
        this.potAllowance('sai', method, cup, value);
        break;
      case 'give':
        this.executeMethodCupValue(method, cup, value, false);
        break;
      case 'cash':
        this.pitAllowance('sai', method, web3.fromWei(this.state.sai.sai.myBalance));
        break;
      case 'lpc-pool':
        this.lpcAllowance(token, token, method, value, web3.toWei(value));
        break;
      case 'lpc-exit':
        let lpsEq = null;
        if (token === 'gem') {
          lpsEq = wdiv(web3.toBigNumber(value).times(wmul(this.state.sai.pip.val, this.state.sai.lpc.per)), this.state.sai.tip.par);
        } else {
          lpsEq = web3.toBigNumber(value).times(this.state.sai.lpc.per);
        }
        lpsEq = lpsEq.round(0);
        if (lpsEq.lt(this.state.sai.lpc.pie)) {
          lpsEq = wmul(lpsEq, this.state.sai.lpc.gap);
        }

        if (this.state.sai.lps.myBalance.lt(lpsEq)) {
          error = 'Not enough balance in LPS to exit this amount of TOKEN.'.replace('TOKEN', token.toUpperCase());
        } else {
          // Margin in allowance to solve dynamic 'par' value
          lpsEq = lpsEq.times(1.01);
          this.lpcAllowance(token, 'lps', method, value, lpsEq);
        }
        break;
      case 'lpc-take':
        if (token === 'gem') {
          const valueSai = web3.toBigNumber(value).times(wmul(this.state.sai.pip.val, this.state.sai.lpc.gap));
          if (this.state.sai.sai.myBalance.lt(valueSai)) {
            error = `Not enough balance in SAI to take ${value} WETH.`;
          } else {
            this.lpcAllowance(token, 'sai', method, value, valueSai);
          }
        } else if (token === 'sai') {
          const valueGem = web3.toBigNumber(value).times(wdiv(this.state.sai.lpc.gap, this.state.sai.pip.val)).round(0);
          if (this.state.sai.gem.myBalance.lt(valueGem)) {
            error = `Not enough balance in WETH to take ${value} SAI.`;
          } else {
            this.lpcAllowance(token, 'gem', method, value, valueGem);
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
    this[`${token}Obj`].transfer(to, web3.toWei(amount), {}, (e, tx) => {
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
      exit: this.isUser() && this.state.sai.skr.myBalance.gt(0)
                          && (this.state.sai.tub.reg.eq(0) ||
                             (this.state.sai.tub.reg.eq(1) && this.state.sai.sin.potBalance.eq(0) && this.state.sai.skr.pitBalance.eq(0))),
      boom: this.isUser() && this.state.sai.tub.reg.eq(0) && this.state.sai.tub.avail_boom_sai && this.state.sai.tub.avail_boom_sai.gt(0),
      bust: this.isUser() && this.state.sai.tub.reg.eq(0) && this.state.sai.tub.avail_bust_sai && this.state.sai.tub.avail_bust_sai.gt(0),
    };

    const helpers = {
      cash: 'Exchange your SAI to WETH',
      open: 'Open a new CUP (debt position)',
      join: 'Deposit WETH in exchange of SKR',
      exit: 'Withdraw WETH in exchange of SKR',
      boom: 'Buy SAI in exchange of SKR',
      bust: 'Sell SAI in exchange of SKR',
    };

    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            Sai Explorer
            <small>Version 1.0{/*<button onClick={this.toggle}>Toggle to connect or disconnect</button>*/}</small>
          </h1>
        </section>
        <section className="content">
          <div>
            <div className="row">
              <div className="col-md-12">
                <GeneralInfo tub={ this.state.sai.tub.address } tap={ this.state.sai.tap.address } top={ this.state.sai.top.address } lpc={ this.state.sai.lpc.address } network={ this.state.network.network } account={ this.state.network.defaultAccount } role={ this.state.sai.tub.role }
                  initContracts={this.initContracts} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-9">
                <div className="row">
                  <Token sai={ this.state.sai } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='gem' color='' />
                  <Token sai={ this.state.sai } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='skr' color='bg-aqua' />
                  <Token sai={ this.state.sai } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='sai' color='bg-green' />
                  <Token sai={ this.state.sai } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='sin' color='bg-red' />
                  {/*<Token sai={ this.state.sai } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='lps' color='bg-blue' />*/}
                </div>
                <SystemStatus sai={ this.state.sai } />
                <Cups sai={ this.state.sai } network={ this.state.network } handleOpenModal={ this.handleOpenModal } tab={ this.tab } all={ this.state.params && this.state.params[0] && this.state.params[0] === 'all' } />
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
                              { actions[key] ? <a href="#action" data-method={ key } onClick={ this.handleOpenModal } title={ helpers[key] }>{ key }</a> : key }
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
                  this.state.sai.pip.address && this.state.network.network !== 'private' &&
                  <FeedValue address={ this.state.sai.pip.address } pipVal={ this.state.sai.pip.val } />
                }
                <Transfer transferToken={ this.transferToken } sai={ this.state.sai } />
              </div>
            </div>
          </div>
          <Modal sai={ this.state.sai } modal={ this.state.modal } updateValue={ this.updateValue } handleCloseModal={ this.handleCloseModal } reg={ this.state.sai.tub.reg } tab={ this.tab } />
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
