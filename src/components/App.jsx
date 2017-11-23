import React, { Component } from 'react';
import NoConnection from './NoConnection';
import TermsModal from './modals/TermsModal';
import Modal from './modals/Modal';
import VideoModal from './modals/VideoModal';
import TerminologyModal from './modals/TerminologyModal';
import CupHistoryModal from './modals/CupHistoryModal';
import Token from './Token';
import GeneralInfo from './GeneralInfo';
import TokenAllowance from './TokenAllowance';
import PriceChart from './PriceChart';
import Stats from './Stats';
import SystemStatus from './SystemStatus';
import Cups from './Cups';
import Wrap from './Wrap';
import Transfer from './Transfer';
import FeedValue from './FeedValue';
import ResourceButtons from './ResourceButtons';
import web3, { initWeb3 } from  '../web3';
import ReactNotify from '../notify';
import { WAD, toBytes32, addressToBytes32, fromRaytoWad, wmul, wdiv, etherscanTx } from '../helpers';
import logo from '../makerdao.svg';
import './App.css';

const settings = require('../settings');

const tub = require('../abi/saitub');
const top = require('../abi/saitop');
const tap = require('../abi/saitap');
const vox = require('../abi/saivox');
const dsproxyfactory = require('../abi/dsproxyfactory');
const dsproxy = require('../abi/dsproxy');
const dsethtoken = require('../abi/dsethtoken');
const dstoken = require('../abi/dstoken');
const dsvalue = require('../abi/dsvalue');

class App extends Component {
  constructor() {
    super();
    const initialState = this.getInitialState();
    this.state = {
      ...initialState,
      network: {},
      profile: {
        mode: localStorage.getItem('mode') || 'account',
        proxy: null,
        activeProfile: null,
        accountBalance: web3.toBigNumber(-1),
      },
      transactions: {},
      termsModal: {
        announcement: true,
        terms: true,
        video: true,
      },
      videoModal: {
        show: false
      },
      terminologyModal: {
        show: false
      },
      cupHistoryModal: {
        show: false
      },
      modal: {
        show: false
      },
      params: ''
    }
  }

  getInitialState = () => {
    return {
      system: {
        tub: {
          address: null,
          authority: null,
          eek: 'undefined',
          safe: 'undefined',
          off: -1,
          out: -1,
          axe: web3.toBigNumber(-1),
          mat: web3.toBigNumber(-1),
          hat: web3.toBigNumber(-1),
          fit: web3.toBigNumber(-1),
          tax: web3.toBigNumber(-1),
          fee: web3.toBigNumber(-1),
          chi: web3.toBigNumber(-1),
          rhi: web3.toBigNumber(-1),
          rho: web3.toBigNumber(-1),
          gap: web3.toBigNumber(-1),
          tag: web3.toBigNumber(-1),
          per: web3.toBigNumber(-1),
          avail_boom_skr: web3.toBigNumber(-1),
          avail_boom_dai: web3.toBigNumber(-1),
          avail_bust_skr: web3.toBigNumber(-1),
          avail_bust_dai: web3.toBigNumber(-1),
          cups: {},
        },
        top: {
          address: null,
        },
        tap: {
          address: null,
          gap: web3.toBigNumber(-1),
        },
        vox: {
          address: null,
          era: web3.toBigNumber(-1),
          tau: web3.toBigNumber(-1),
          par: web3.toBigNumber(-1),
          way: web3.toBigNumber(-1),
        },
        pit: {
          address: null,
        },
        gem: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          tubBalance: web3.toBigNumber(-1),
          tapBalance: web3.toBigNumber(-1),
        },
        gov: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          pitBalance: web3.toBigNumber(-1),
          tubApproved: -1,
        },
        skr: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          tubBalance: web3.toBigNumber(-1),
          tapBalance: web3.toBigNumber(-1),
          tubApproved: -1,
          tapApproved: -1,
        },
        dai: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          tapBalance: web3.toBigNumber(-1),
          tubApproved: -1,
          tapApproved: -1,
        },
        sin: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          tubBalance: web3.toBigNumber(-1),
          tapBalance: web3.toBigNumber(-1),
          // This field will keep an estimated value of new sin which is being generated due the 'stability/issuer fee'.
          // It will return to zero each time 'drip' is called
          issuerFee: web3.toBigNumber(0),
        },
        pip: {
          address: null,
          val: web3.toBigNumber(-1),
        },
        pep: {
          address: null,
          val: web3.toBigNumber(-1),
        },
        chartData: {
          ethusd: {},
          skreth: {},
          daiusd: {},
          ethdai: {},
        },
        stats: {
          error: false
        },
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
            networkState.latestBlock = res.number;
            networkState.outOfSync = e != null || ((new Date().getTime() / 1000) - res.timestamp) > 600;
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
                  network = 'main';
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
          networkState.isConnected = isConnected;
          networkState.network = false;
          networkState.latestBlock = 0;
          this.setState({ network: networkState });
        }
      }
    });
  }

  initNetwork = (newNetwork) => {
    //checkAccounts();
    const networkState = { ...this.state.network };
    networkState.network = newNetwork;
    networkState.isConnected = true;
    networkState.latestBlock = 0;
    this.setState({ network: networkState }, () => {
      const addrs = settings.chain[this.state.network.network];
      this.initContracts(addrs.top);
    });
  }

  checkAccounts = (checkAccountChange = true) => {
    web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        const networkState = { ...this.state.network };
        networkState.accounts = accounts;
        const oldDefaultAccount = networkState.defaultAccount;
        networkState.defaultAccount = accounts[0];
        web3.eth.defaultAccount = networkState.defaultAccount;
        this.setState({ network: networkState }, () => {
          if (checkAccountChange && oldDefaultAccount !== networkState.defaultAccount) {
            this.initContracts(this.state.system.top.address);
          }
        });
      }
    });
  }

  componentDidMount = () => {
    setTimeout(this.init, 500);
  }

  init = () => {
    initWeb3(web3);

    this.checkNetwork();
    this.checkAccounts(false);

    this.setHashParams();
    window.onhashchange = () => {
      this.setHashParams();
      this.initContracts(this.state.system.top.address);
    }

    if (localStorage.getItem('termsModal')) {
      const termsModal = JSON.parse(localStorage.getItem('termsModal'));
      this.setState({ termsModal });
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

  validateAddresses = (topAddress) => {
    return web3.isAddress(topAddress);
  }

  initContracts = (topAddress) => {
    if (!this.validateAddresses(topAddress)) {
      return;
    }
    web3.reset(true);
    if (typeof this.timeVariablesInterval !== 'undefined') clearInterval(this.timeVariablesInterval);
    if (typeof this.pendingTxInterval !== 'undefined') clearInterval(this.pendingTxInterval);
    const initialState = this.getInitialState();
    this.setState({
      ...initialState
    }, () => {
      window.topObj = this.topObj = this.loadObject(top.abi, topAddress);
      const addrs = settings.chain[this.state.network.network];

      const setUpPromises = [this.getTubAddress(), this.getTapAddress()];
      if (addrs.proxyFactory) {
        window.proxyFactoryObj = this.proxyFactoryObj = this.loadObject(dsproxyfactory.abi, addrs.proxyFactory);
        setUpPromises.push(this.getProxyAddress());
      }
      Promise.all(setUpPromises).then((r) => {
        if (r[0] && r[1] && web3.isAddress(r[0]) && web3.isAddress(r[1])) {
          window.tubObj = this.tubObj = this.loadObject(tub.abi, r[0]);
          window.tapObj = this.tapObj = this.loadObject(tap.abi, r[1]);
          const system = { ...this.state.system };
          const profile = { ...this.state.profile };

          system.top.address = topAddress;
          system.tub.address = r[0];
          system.tap.address = r[1];

          if (addrs.proxyFactory && r[2].length > 0) {
            profile.proxy = r[2][r[2].length - 1].args.proxy;
            profile.activeProfile = localStorage.getItem('mode') === 'proxy' ? profile.proxy : this.state.network.defaultAccount;
            window.proxyObj = this.proxyObj = this.loadObject(dsproxy.abi, profile.proxy);
          } else {
            profile.activeProfile = this.state.network.defaultAccount;
            profile.mode = 'account';
            localStorage.setItem('mode', 'account');
          }

          this.setState({ system, profile }, () => {
            const promises = [this.setUpVox(), this.setUpPit()];
            Promise.all(promises).then((r) => {
              this.initializeSystemStatus();

              this.setUpToken('gem');
              this.setUpToken('gov');
              this.setUpToken('skr');
              this.setUpToken('dai');
              this.setUpToken('sin');

              this.setFiltersTub(this.state.params && this.state.params[0] && this.state.params[0] === 'all' ? false : this.state.profile.activeProfile);
              this.setFiltersTap();
              this.setFiltersVox();
              this.setFilterFeedValue('pip');
              this.setFilterFeedValue('pep');
              this.setTimeVariablesInterval();

              // This is necessary to finish transactions that failed after signing
              this.setPendingTxInterval();
            });
          });
        } else {
          alert('This is not a Top address');
        }
      });
    });
  }

  loadEraRho = () => {
    const promises = [
                      this.getParameterFromTub('rho'),
                      this.getParameterFromVox('era')
                      ];
    Promise.all(promises).then((r) => {
      if (r[0] === true && r[1] === true && this.state.system.tub.tax.gte(0) && this.state.system.sin.tubBalance.gte(0)) {
        this.setState((prevState, props) => {
          const system = {...prevState.system};
          const sin = {...system.sin};
          sin.issuerFee = system.sin.tubBalance.times(web3.fromWei(system.tub.tax).pow(system.vox.era.minus(system.tub.rho))).minus(system.sin.tubBalance).round(0);
          system.sin = sin;
          return { system };
        });
      }
    });
  }

  setTimeVariablesInterval = () => {
    this.timeVariablesInterval = setInterval(() => {
      this.getParameterFromTub('chi', true);
      this.getParameterFromTub('rhi', true);
      this.getParameterFromVox('par', true);
      this.loadEraRho();
      this.getAccountBalance();
    }, 5000);
  }

  setPendingTxInterval = () => {
    this.pendingTxInterval = setInterval(() => {
      this.checkPendingTransactions()
    }, 10000);
  }

  getAccountBalance = () => {
    if (web3.isAddress(this.state.profile.activeProfile)) {
      web3.eth.getBalance(this.state.profile.activeProfile, (e, r) => {
        const profile = { ...this.state.profile };
        profile.accountBalance = r;
        this.setState({ profile });
      });
    }
  }

  getTubAddress = () => {
    const p = new Promise((resolve, reject) => {
      this.topObj.tub.call((e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getTapAddress = () => {
    const p = new Promise((resolve, reject) => {
      this.topObj.tap.call((e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getProxyAddress = () => {
    const p = new Promise((resolve, reject) => {
      const addrs = settings.chain[this.state.network.network];
      this.proxyFactoryObj.Created({ sender: this.state.network.defaultAccount }, { fromBlock: addrs.fromBlock }).get((e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  setUpVox = () => {
    const p = new Promise((resolve, reject) => {
      this.tubObj.vox.call((e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = {...prevState.system};
            const vox = {...system.vox};
            vox.address = r;
            system.vox = vox;
            return { system };
          }, () => {
            window.voxObj = this.voxObj = this.loadObject(vox.abi, r);
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  setUpPit = () => {
    const p = new Promise((resolve, reject) => {
      this.tubObj.pit.call((e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = {...prevState.system};
            const pit = {...system.pit};
            pit.address = r;
            system.pit = pit;
            return { system };
          }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  setUpToken = (token) => {
    this.tubObj[token.replace('dai', 'sai')].call((e, r) => {
      if (!e) {
        this.setState((prevState, props) => {
          const system = {...prevState.system};
          const tok = {...system[token]};
          tok.address = r;
          system[token] = tok;
          return { system };
        }, () => {
          window[`${token}Obj`] = this[`${token}Obj`] = this.loadObject(token === 'gem' ? dsethtoken.abi : dstoken.abi, r);
          this.getDataFromToken(token);
          this.setFilterToken(token);
        });
      }
    })
  }

  setFilterToken = (token) => {
    const filters = ['Transfer'];

    if (token === 'gem') {
      filters.push('Deposit');
      filters.push('Withdrawal');
    } else {
      filters.push('Mint');
      filters.push('Burn');
      filters.push('Approval');
    }

    for (let i = 0; i < filters.length; i++) {
      const conditions = {};
      if (this[`${token}Obj`][filters[i]]) {
        this[`${token}Obj`][filters[i]](conditions, { fromBlock: 'latest' }, (e, r) => {
          if (!e) {
            this.logTransactionConfirmed(r.transactionHash);
            this.getDataFromToken(token);
          }
        });
      }
    }
  }

  getCupsFromChain = (address, conditions, fromBlock) => {
    this.tubObj.LogNewCup(conditions, { fromBlock }, (e, r) => {
      if (!e) {
        this.getCup(r.args.cup, address);
      }
    });
    if (address) {
      // Get cups given to address (only if not seeing all cups).
      this.tubObj.LogNote({ sig: this.methodSig('give(bytes32,address)'), bar: toBytes32(address) }, { fromBlock }, (e, r) => {
        if (!e) {
          this.getCup(r.args.foo, address);
        }
      });
    }
  }

  getFromService = (service, conditions = {}, sort = {}) => {
    const p = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      let conditionsString = '';
      let sortString = '';
      Object.keys(conditions).map(key => {
        conditionsString += `${key}:${conditions[key]}`;
        conditionsString += Object.keys(conditions).pop() !== key ? '&' : '';
        return false;
      });
      conditionsString = conditionsString !== '' ? `/conditions=${conditionsString}` : '';
      Object.keys(sort).map(key => {
        sortString += `${key}:${sort[key]}`;
        sortString += Object.keys(sort).pop() !== key ? '&' : '';
        return false;
      });
      sortString = sortString !== '' ? `/sort=${sortString}` : '';
      const url = `${settings.chain[this.state.network.network].service}${settings.chain[this.state.network.network].service.slice(-1) !== '/' ? '/' : ''}${service}${conditionsString}${sortString}`;
      xhr.open('GET', url, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          reject(xhr.status);
        }
      }
      xhr.send();
    });
    return p;
  }

  setFiltersTub = (address) => {
    // Get open cups by address (or all)
    let conditions = {};
    if (address) {
      conditions = { lad: address }
    }

    const me = this;
    if (settings.chain[this.state.network.network].service) {
      Promise.resolve(this.getFromService('cups', conditions, { cupi:'desc' })).then((response) => {
        response.results.forEach(function (v) {
          me.getCup(toBytes32(v.cupi), address);
        });
        me.getCupsFromChain(address, conditions, response.last_block);
      }).catch((error) => {
        me.getCupsFromChain(address, conditions, settings.chain[this.state.network.network].fromBlock);
      });
    } else {
      this.getCupsFromChain(address, conditions, settings.chain[this.state.network.network].fromBlock);
    }

    const cupSignatures = [
      'lock(bytes32,uint256)',
      'free(bytes32,uint256)',
      'draw(bytes32,uint256)',
      'wipe(bytes32,uint256)',
      'bite(bytes32)',
      'shut(bytes32)',
      'give(bytes32,address)',
    ].map((v) => this.methodSig(v));

    this.tubObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (cupSignatures.indexOf(r.args.sig) !== -1) {
          this.getCup(r.args.foo, address);
        } else if (r.args.sig === this.methodSig('mold(bytes32,uint256)')) {
          const ray = ['axe', 'mat', 'tax', 'fee'].indexOf(web3.toAscii(r.args.foo).substring(0,3)) !== -1;
          const callback = ['mat'].indexOf(web3.toAscii(r.args.foo).substring(0,3)) !== -1 ? this.calculateSafetyAndDeficit: () => {};          
          this.getParameterFromTub(web3.toAscii(r.args.foo).substring(0,3), ray, callback);
        } else if (r.args.sig === this.methodSig('cage(uint256,uint256)')) {
          this.getParameterFromTub('off');
          this.getParameterFromTub('fit');
        } else if (r.args.sig === this.methodSig('flow()')) {
          this.getParameterFromTub('out');
        }
        if (r.args.sig === this.methodSig('drip()') ||
            r.args.sig === this.methodSig('chi()') ||
            r.args.sig === this.methodSig('rhi()') ||
            r.args.sig === this.methodSig('draw(bytes32,uint256)') ||
            r.args.sig === this.methodSig('wipe(bytes32,uint256)') ||
            r.args.sig === this.methodSig('shut(bytes32)') ||
            (r.args.sig === this.methodSig('mold(bytes32,uint256)') && web3.toAscii(r.args.foo).substring(0,3) === 'tax')) {
          this.getParameterFromTub('chi', true);
          this.getParameterFromTub('rhi', true);
          this.loadEraRho();
        }
      }
    });
  }

  setFiltersTap = () => {
    this.tapObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('mold(bytes32,uint256)')) {
          this.getParameterFromTap('gap', false, this.getBoomBustValues());
        }
      }
    });
  }

  setFiltersVox = () => {
    this.voxObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('mold(bytes32,uint256)')) {
          this.getParameterFromVox('way', true);
        }
      }
    });
  }

  setFilterFeedValue = (obj) => {
    this.tubObj[obj].call((e, r) => {
      if (!e) {
        this.setState((prevState, props) => {
          const system = {...prevState.system};
          const feed = {...system[obj]};
          feed.address = r;
          system[obj] = feed;
          return { system };
        }, () => {
          window[`${obj}Obj`] = this[`${obj}Obj`] = this.loadObject(dsvalue.abi, r);
          this.getValFromFeed(obj);

          this[`${obj}Obj`].LogNote({}, { fromBlock: 'latest' }, (e, r) => {
            if (!e) {
              if (
                r.args.sig === this.methodSig('poke(bytes32)') ||
                r.args.sig === this.methodSig('poke()')
              ) {
                this.getValFromFeed(obj);
                if (obj === 'pip') {
                  this.getParameterFromTub('tag', true, this.calculateSafetyAndDeficit);
                }
              }
            }
          });
        });
      }
    })
  }

  getDataFromToken = (token) => {
    this.getTotalSupply(token);

    if (token !== 'sin') {
      this.getBalanceOf(token, this.state.profile.activeProfile, 'myBalance');
    }
    if (token === 'gem' || token === 'skr' || token === 'sin') {
      this.getBalanceOf(token, this.state.system.tub.address, 'tubBalance');
    }
    if (token === 'gem' || token === 'skr' || token === 'dai' || token === 'sin') {
      this.getBalanceOf(token, this.state.system.tap.address, 'tapBalance');
      this.getBoomBustValues();
    }
    if (token === 'gem' || token === 'skr') {
      this.getParameterFromTub('per', true);
    }
    if (token === 'skr' || token === 'dai' || token === 'gov') {
      this.getApproval(token, 'tub');
      if (token !== 'gov') {
        this.getApproval(token, 'tap');
      }
    }
    if (token === 'gov') {
      this.getBalanceOf(token, this.state.system.pit.address, 'pitBalance');
    }
  }

  getApproval = (token, dst) => {
    Promise.resolve(this.allowance(token, dst)).then(r => {
      this.setState((prevState, props) => {
        const system = {...prevState.system};
        const tok = {...system[token]};
        tok[`${dst}Approved`] = r.eq(web3.toBigNumber(2).pow(256).minus(1));
        system[token] = tok;
        return { system };
      });
    });
  }

  getTotalSupply = (name) => {
    this[`${name}Obj`].totalSupply.call((e, r) => {
      if (!e) {
        this.setState((prevState, props) => {
          const system = {...prevState.system};
          const tok = {...system[name]};
          tok.totalSupply = r;
          system[name] = tok;
          return { system };
        }, () => {
          if (name === 'sin') {
            this.calculateSafetyAndDeficit();
          }
        });
      }
    })
  }

  getBalanceOf = (name, address, field) => {
    this[`${name}Obj`].balanceOf.call(address, (e, r) => {
      if (!e) {
        this.setState((prevState, props) => {
          const system = {...prevState.system};
          const tok = {...system[name]};
          tok[field] = r;
          system[name] = tok;
          return { system };
        }, () => {
          if ((name === 'skr' || name === 'dai') && field === 'tubBalance') {
            this.calculateSafetyAndDeficit();
          }
        });
      }
    })
  }

  initializeSystemStatus = () => {
    this.getParameterFromTub('authority');
    this.getParameterFromTub('off');
    this.getParameterFromTub('out');
    this.getParameterFromTub('axe', true);
    this.getParameterFromTub('mat', true, this.calculateSafetyAndDeficit);
    this.getParameterFromTub('hat');
    this.getParameterFromTub('fit');
    this.getParameterFromTub('tax', true);
    this.getParameterFromTub('fee', true);
    this.getParameterFromTub('chi', true);
    this.getParameterFromTub('rhi', true);
    this.getParameterFromTub('per', true);
    this.getParameterFromTub('gap');
    this.getParameterFromTub('tag', true, this.calculateSafetyAndDeficit);
    this.getParameterFromTap('gap', false, this.getBoomBustValues);
    this.getParameterFromVox('way', true);
    this.getParameterFromVox('par', true);
    this.loadEraRho();
    this.getAccountBalance();
    if (settings.chain[this.state.network.network].service) {
      if (settings.chain[this.state.network.network].chart) {
        this.getChartData();
      }
      this.getStats();
    }
  }

  calculateSafetyAndDeficit = () => {
    if (this.state.system.tub.mat.gte(0) && this.state.system.skr.tubBalance.gte(0) && this.state.system.tub.tag.gte(0) && this.state.system.sin.totalSupply.gte(0)) {
      this.setState((prevState, props) => {
        const system = {...prevState.system};
        const tub = {...system.tub};

        const pro = wmul(system.skr.tubBalance, system.tub.tag);
        const con = system.sin.totalSupply;
        tub.eek = pro.lt(con);

        const min = wmul(con, tub.mat);
        tub.safe = pro.gte(min);

        system.tub = tub;
        return { system };
      });
    }
  }

  getParameterFromTub = (field, ray = false, callback = false) => {
    const p = new Promise((resolve, reject) => {
      this.tubObj[field].call((e, value) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = {...prevState.system};
            const tub = {...system.tub};
            tub[field] = ray ? fromRaytoWad(value) : value;
            system.tub = tub;
            return { system };
          }, () => {
            this.getBoomBustValues();
            Object.keys(this.state.system.tub.cups).map(key =>
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

  getParameterFromTap = (field, ray = false) => {
    const p = new Promise((resolve, reject) => {
      this.tapObj[field].call((e, value) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = {...prevState.system};
            const tap = {...system.tap};
            tap[field] = ray ? fromRaytoWad(value) : value;
            system.tap = tap;
            return { system };
          }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getParameterFromVox = (field, ray = false) => {
    const p = new Promise((resolve, reject) => {
      this.voxObj[field].call((e, value) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = {...prevState.system};
            const vox = {...system.vox};
            vox[field] = ray ? fromRaytoWad(value) : value;
            system.vox = vox;
            return { system };
          }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getValFromFeed = (obj) => {
    const p = new Promise((resolve, reject) => {
      this[`${obj}Obj`].peek.call((e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = {...prevState.system};
            const feed = {...system[obj]};
            feed.val = web3.toBigNumber(r[1] ? parseInt(r[0], 16) : -2);
            system[obj] = feed;
            return { system };
          }, () => {
            if (obj === 'pip') {
              this.getBoomBustValues();
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

  getBoomBustValues = () => {
    if (this.state.system.dai.tapBalance.gte(0)
        //&& this.state.system.sin.issuerFee.gte(0)
        && this.state.system.sin.tapBalance.gte(0)
        && this.state.system.vox.par.gte(0)
        && this.state.system.tub.tag.gte(0)
        && this.state.system.tap.gap.gte(0)
        && this.state.system.pip.val.gte(0)
        && this.state.system.skr.tapBalance.gte(0)
        && this.state.system.sin.tubBalance.gte(0)
        && this.state.system.tub.tax.gte(0)
        && this.state.system.skr.tapBalance.gte(0)
        && this.state.system.skr.totalSupply.gte(0)
        && this.state.system.gem.tubBalance.gte(0)) {
      this.setState((prevState, props) => {
        const system = {...prevState.system};
        const tub = {...system.tub};

        // const dif = system.dai.tapBalance.add(system.sin.issuerFee).minus(system.sin.tapBalance); bust & boom don't execute drip anymore so we do not need to do the estimation
        const dif = system.dai.tapBalance.minus(system.sin.tapBalance);
        tub.avail_boom_dai = tub.avail_boom_skr = web3.toBigNumber(0);
        tub.avail_bust_dai = tub.avail_bust_skr = web3.toBigNumber(0);

        // if higher or equal, it means vox.par is static or increases over the time
        // if lower, it means it decreases over the time, so we calculate a future par (in 10 minutes) to reduce risk of tx failures
        const futurePar = system.vox.way.gte(WAD) ? system.vox.par : system.vox.par.times(web3.fromWei(system.vox.way).pow(10*60));

        if (dif.gt(0)) {
          // We can boom
          tub.avail_boom_dai = dif;
          tub.avail_boom_skr = wdiv(wdiv(wmul(tub.avail_boom_dai, futurePar), system.tub.tag), WAD.times(2).minus(system.tap.gap));
        }

        if (system.skr.tapBalance.gt(0) || dif.lt(0)) {
          // We can bust

          // This is a margin we need to take into account as bust quantity goes down per second
          // const futureFee = system.sin.tubBalance.times(web3.fromWei(tub.tax).pow(120)).minus(system.sin.tubBalance).round(0); No Drip anymore!!!
          // const daiNeeded = dif.abs().minus(futureFee);
          const daiNeeded = dif.gte(0) ? web3.toBigNumber(0) : dif.abs();
          const equivalentSKR = wdiv(wdiv(wmul(daiNeeded, futurePar), system.tub.tag), system.tap.gap);

          if (system.skr.tapBalance.gte(equivalentSKR)) {
            tub.avail_bust_skr = system.skr.tapBalance;
            tub.avail_bust_ratio = wmul(wmul(wdiv(WAD, system.vox.par), system.tub.tag), system.tap.gap);
            tub.avail_bust_dai = wmul(tub.avail_bust_skr, tub.avail_bust_ratio);
          } else {
            tub.avail_bust_dai = daiNeeded;
            // We need to consider the case where SKR needs to be minted generating a change in 'system.tub.tag'
            tub.avail_bust_skr = wdiv(system.skr.totalSupply.minus(system.skr.tapBalance), wdiv(wmul(wmul(system.pip.val, system.tap.gap), system.gem.tubBalance), wmul(tub.avail_bust_dai, system.vox.par)).minus(WAD));
            tub.avail_bust_ratio = wdiv(tub.avail_bust_dai, tub.avail_bust_skr);
          }
        }
        system.tub = tub;
        return { system };
      });
    }
  }

  getCup = (idHex, address) => {
    this.tubObj.cups.call(idHex, (e, cupData) => {
      const id = parseInt(idHex, 16);
      const firstLoad = typeof this.state.system.tub.cups[id] === 'undefined';
      if (!address || address === cupData[0]) {
        // This verification needs to be done as the cup could have been given or closed by the user
        this.setState((prevState, props) => {
          const system = {...prevState.system};
          const tub = {...system.tub};
          const cups = {...tub.cups};
          const cup = {
            lad: cupData[0],
            ink: cupData[1],
            art: cupData[2],
            irk: cupData[3],
            safe: firstLoad ? 'N/A' : cups[id]['safe']
          };
          cups[id] = cup;
          tub.cups = cups;
          system.tub = tub;
          return { system };
        }, () => {
          this.updateCup(id);
        });
      } else if(!firstLoad) {
        // This means was already in the collection but the user doesn't own it anymore (used 'give' or 'shut')
        delete this.state.system.tub.cups[id];
      }
    });
  }

  parseCandleData = (data) => {
    const dataParsed = [];
    data.forEach(value => {
      const timestamp = (new Date(value.timestamp * 1000)).setHours(0,0,0);
      const index = dataParsed.length - 1;
      const noWei = value.value / 10 ** 18;
      if (dataParsed.length === 0 || timestamp !== dataParsed[index].date.getTime()) {
        dataParsed.push({
                          date: new Date(timestamp),
                          open: noWei,
                          high: noWei,
                          low: noWei,
                          close: noWei,
                        });
      } else {
        dataParsed[index].high = dataParsed[index].high > noWei ? dataParsed[index].high : noWei;
        dataParsed[index].low = dataParsed[index].low < noWei ? dataParsed[index].low : noWei;
        dataParsed[index].close = noWei;
      }
    });

    return dataParsed;
  }

  setChartState = (key, value) => {
    return new Promise((resolve, reject) => {
      this.setState((prevState, props) => {
        const system = {...prevState.system};
        const chartData = {...system.chartData};
        chartData[key] = value;
        system.chartData = chartData;
        return { system };
      }, () => {
        resolve(value);
      });
    });
  }

  getETHUSDPrice = (timestamps) => {
    return new Promise((resolve, reject) => {
      Promise.resolve(this.getFromService('pips', { 'timestamp.gte': timestamps[30] }, { 'timestamp': 'asc' })).then((response) => {
        response.results = this.parseCandleData(response.results);
        Promise.resolve(this.setChartState('ethusd', response)).then(() => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getSKRETHPrice = (timestamps) => {
    return new Promise((resolve, reject) => {
      Promise.resolve(this.getFromService('pers', {}, { 'timestamp': 'asc' })).then((response) => {
        const finalResponse = { last_block: response.last_block, results: [] };

        // If there is not result before 30 days ago, we assume that the value of SKR/ETH was 1 at that moment
        finalResponse.results.push({ value: 10 ** 18, timestamp: timestamps[30] });

        let lastIndex = 30;
        response.results.forEach(value => {
          if (value.timestamp <= timestamps[30]) {
            finalResponse.results[0] = { value: value.value, timestamp: timestamps[30] };
          } else {
            for (let i = lastIndex; i >= 0; i--) {
              if (value.timestamp > timestamps[i]) {
                finalResponse.results.push({ value: finalResponse.results[finalResponse.results.length - 1].value, timestamp: timestamps[i] });
                lastIndex = i;
              }
            }
            finalResponse.results.push({ value: value.value, timestamp: value.timestamp });
          }
        });
        for (let i = lastIndex; i >= 0; i--) {
          finalResponse.results.push({ value: finalResponse.results[finalResponse.results.length - 1].value, timestamp: timestamps[i] });
          lastIndex = i - 1;
        }
        finalResponse.results = this.parseCandleData(finalResponse.results);
        Promise.resolve(this.setChartState('skreth', finalResponse)).then(() => {
          resolve(finalResponse);
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getDAIUSDPrice = (timestamps) => {
    return new Promise((resolve, reject) => {
      Promise.resolve(this.getFromService('ways')).then((response) => {
        const finalResponse = { last_block: response.last_block, results: [] };

        let lastIndex = 30;
        let lastTimestamp = -1;
        let lastRate = -1;
        let price = web3.toBigNumber(10).pow(18);
        // response.results = [{ timestamp: 1500662100, value: '999999999350000000000000000' }, { timestamp: 1501556300, value: '1000000000750000000000000000' }, { timestamp: 1502161100, value: '999999999350000000000000000' }, { timestamp: 1502852300, value: '1000000000350000000000000000' }];

        if (response.results.length === 0) {
          lastTimestamp = timestamps[30];
          lastRate = web3.toBigNumber(1);
        }
        response.results.forEach(value => {
          for (let i = lastIndex; i >= 0; i--) {
            if (value.timestamp > timestamps[i]) {
              price = price.times(lastRate.pow(timestamps[i] - lastTimestamp));
              lastTimestamp = timestamps[i];
              if (i !== 30) {
                finalResponse.results.push({ value: price.valueOf(), timestamp: timestamps[i] - 1 });
              }
              finalResponse.results.push({ value: price.valueOf(), timestamp: timestamps[i] });
              lastIndex = i - 1;
            }
          }
          if (lastTimestamp !== -1) {
            price = price.times(lastRate.pow(value.timestamp - lastTimestamp));
          }
          lastTimestamp = value.timestamp;
          lastRate = web3.toBigNumber(value.value).div(web3.toBigNumber(10).pow(27));
          if (value.timestamp >= timestamps[30]) {
            finalResponse.results.push({ value: price.valueOf(), timestamp: value.timestamp });
          }
        });
        for (let i = lastIndex; i >= 0; i--) {
          price = price.times(lastRate.pow(timestamps[i] - lastTimestamp));
          lastTimestamp = timestamps[i];
          if (i !== 30) {
            finalResponse.results.push({ value: price.valueOf(), timestamp: timestamps[i] - 1 });
          }
          finalResponse.results.push({ value: price.valueOf(), timestamp: timestamps[i] });
          lastIndex = i - 1;
        }

        finalResponse.results = this.parseCandleData(finalResponse.results);
        Promise.resolve(this.setChartState('daiusd', finalResponse)).then(() => {
          resolve(finalResponse);
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getChartData = () => {
    const timestamps = [];
    for (let i = 0; i <= 30; i++) {
      timestamps[i] = parseInt(((new Date()).setHours(0,0,0) - i*24*60*60*1000) / 1000, 10);
    }
    const promises = [];
    // ETH/USD
    promises.push(this.getETHUSDPrice(timestamps));
    // DAI/USD
    promises.push(this.getDAIUSDPrice(timestamps));
    // SKR/ETH
    this.getSKRETHPrice(timestamps);

    Promise.all(promises).then((r) => {
      if (r[0] && r[1]) {
        const ethdai = { results: [] };
        r[0].results.forEach((value, index) => {
          ethdai.results.push({
            date: value.date,
            open: value.open / r[1].results[index].open,
            high: value.high / r[1].results[index].high,
            low: value.low / r[1].results[index].low,
            close: value.close / r[1].results[index].close,
          });
        });
        this.setChartState('ethdai', ethdai);
      }
    }).catch((error) => {
    });
  }

  getStats = () => {
    Promise.resolve(this.getFromService('cupStats')).then((response) => {
      this.setState((prevState, props) => {
        const system = {...prevState.system};
        system.stats = { error: false, results: response.results };
        return { system };
      });
    }).catch((error) => {
      this.setState((prevState, props) => {
        const system = {...prevState.system};
        system.stats = { error: true };
        return { system };
      });
    });
  }

  tab = (cup) => {
    return wmul(cup.art, this.state.system.tub.chi).round(0);
  }

  rap = (cup) => {
    return wmul(cup.irk, this.state.system.tub.rhi).minus(this.tab(cup)).round(0);
  }

  updateCup = (id) => {
    this.setState((prevState, props) => {
      const system = {...prevState.system};
      const tub = {...system.tub};
      const cups = {...tub.cups};
      const cup = {...cups[id]};

      cup.pro = wmul(cup.ink, system.tub.tag).round(0);
      cup.ratio = cup.pro.div(wmul(this.tab(cup), system.vox.par));
      // This is to give a window margin to get the maximum value (as 'chi' is dynamic value per second)
      const marginTax = web3.fromWei(tub.tax).pow(120);
      cup.avail_dai = wdiv(cup.pro, wmul(tub.mat, system.vox.par)).minus(this.tab(cup)).round(0).minus(1); // "minus(1)" to avoid rounding issues when dividing by mat (in the contract uses it mulvoxlying on safe function)
      cup.avail_dai_with_margin = wdiv(cup.pro, wmul(tub.mat, system.vox.par)).minus(this.tab(cup).times(marginTax)).round(0).minus(1);
      cup.avail_dai_with_margin = cup.avail_dai_with_margin.lt(0) ? web3.toBigNumber(0) : cup.avail_dai_with_margin;
      cup.avail_skr = cup.ink.minus(wdiv(wmul(wmul(this.tab(cup), tub.mat), system.vox.par), system.tub.tag)).round(0);
      cup.avail_skr_with_margin = cup.ink.minus(wdiv(wmul(wmul(this.tab(cup).times(marginTax), tub.mat), system.vox.par), system.tub.tag)).round(0);
      cup.avail_skr_with_margin = cup.avail_skr_with_margin.lt(0) ? web3.toBigNumber(0) : cup.avail_skr_with_margin;
      cup.liq_price = cup.ink.gt(0) && cup.art.gt(0) ? wdiv(wdiv(wmul(this.tab(cup), tub.mat), system.tub.per), cup.ink) : web3.toBigNumber(0);

      cups[id] = cup;
      tub.cups = cups;
      system.tub = tub;
      return { system }
    }, () => {
      this.tubObj.safe['bytes32'].call(toBytes32(id), (e, safe) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = {...prevState.system};
            const tub = {...system.tub};
            const cups = {...tub.cups};
            const cup = {...cups[id]};

            cup.safe = safe;

            cups[id] = cup;
            tub.cups = cups;
            system.tub = tub;
            return { system }
          });
        }
      });
    });
  }

  methodSig = (method) => {
    return web3.sha3(method).substring(0, 10)
  }

  // Modals
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

  handleOpenVideoModal = (e) => {
    e.preventDefault();
    this.setState({ videoModal: { show: true } });
  }

  handleCloseVideoModal = (e) => {
    e.preventDefault();
    this.markAsAccepted('video');
    this.setState({ videoModal: { show: false } });
  }

  handleOpenTerminologyModal = (e) => {
    e.preventDefault();
    this.setState({ terminologyModal: { show: true } });
  }

  handleCloseTerminologyModal = (e) => {
    e.preventDefault();
    this.setState({ terminologyModal: { show: false } });
  }

  handleOpenCupHistoryModal = (e) => {
    e.preventDefault();
    const id = e.target.getAttribute('data-id');
    const me = this;
    this.setState({ cupHistoryModal: { show: true, id } }, () => {
      if (settings.chain[this.state.network.network].service) {
        Promise.resolve(this.getFromService('cupHistoryActions', { cupi: id }, { timestamp:'asc' })).then((response) => {
          me.setState({ cupHistoryModal: { show: true, error: false, id, actions: response.results } });
        }).catch(error => {
          me.setState({ cupHistoryModal: { show: true, error: true } });
        });
      }
    });
  }

  handleCloseCupHistoryModal = (e) => {
    e.preventDefault();
    this.setState({ cupHistoryModal: { show: false } });
  }

  markAsAccepted = (type) => {
    const termsModal = { ...this.state.termsModal };
    termsModal[type] = false;
    this.setState({ termsModal }, () => {
      localStorage.setItem('termsModal', JSON.stringify(termsModal));
    });
  }
  //

  // Transactions
  checkPendingTransactions = () => {
    const transactions = { ...this.state.transactions };
    Object.keys(transactions).map(tx => {
      if (transactions[tx].pending) {
        web3.eth.getTransactionReceipt(tx, (e, r) => {
          if (!e && r !== null) {
            if (r.logs.length === 0) {
              this.logTransactionFailed(tx);
            } else if (r.blockNumber)  {
              this.logTransactionConfirmed(tx);
            }
          }
        });
      }
      return false;
    });
  }

  logRequestTransaction = (id, title) => {
    const msgTemp = 'Waiting for transaction signature...';
    this.refs.notificator.info(id, title, msgTemp, false);
  }

  logPendingTransaction = (id, tx, title, callback = []) => {
    const msgTemp = 'Transaction TX was created. Waiting for confirmation...';
    const transactions = { ...this.state.transactions };
    transactions[tx] = { pending: true, title, callback }
    this.setState({ transactions });
    console.log(msgTemp.replace('TX', tx));
    this.refs.notificator.hideNotification(id);
    this.refs.notificator.info(tx, title, etherscanTx(this.state.network.network, msgTemp.replace('TX', `${tx.substring(0,10)}...`), tx), false);
  }

  logTransactionConfirmed = (tx) => {
    const msgTemp = 'Transaction TX was confirmed.';
    const transactions = { ...this.state.transactions };
    if (transactions[tx] && transactions[tx].pending) {
      transactions[tx].pending = false;
      this.setState({ transactions }, () => {
        console.log(msgTemp.replace('TX', tx));
        this.refs.notificator.hideNotification(tx);
        this.refs.notificator.success(tx, transactions[tx].title, etherscanTx(this.state.network.network, msgTemp.replace('TX', `${tx.substring(0,10)}...`), tx), 4000);
        if (transactions[tx].callback.length > 0) {
          this.executeCallback(transactions[tx].callback);
        }
      });
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

  logTransactionRejected = (tx, title) => {
    const msgTemp = 'User denied transaction signature.';
    this.refs.notificator.error(tx, title, msgTemp, 4000);
  }
  //

  // Actions
  executeMethod = (object, method) => {
    const id = Math.random();
    const title = `${object.toUpperCase()}: ${method}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.basicActions,
                            `${this.methodSig(`${method}(address)`)}${addressToBytes32(this.state.system[object].address, false)}`,
                            log);
    } else {
      this[`${object}Obj`][method]({}, log);
    }
  }

  executeMethodCup = (method, cup) => {
    const id = Math.random();
    const title = `TUB: ${method} ${cup}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.basicActions,
                            `${this.methodSig(`${method}(address,bytes32)`)}${addressToBytes32(this.tubObj.address, false)}${toBytes32(cup, false)}`,
                            log);
    } else {
      this.tubObj[method](toBytes32(cup), {}, log);
    }
  }

  executeMethodValue = (object, method, value) => {
    const id = Math.random();
    const title = `${object.toUpperCase()}: ${method} ${value}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.basicActions,
                            `${this.methodSig(`${method}(address,uint256)`)}${addressToBytes32(this.state.system[object].address, false)}${toBytes32(web3.toWei(value), false)}`,
                            log);
    } else {
      this[`${object}Obj`][method](web3.toWei(value), {}, log);
    }
  }

  executeMethodCupValue = (method, cup, value, toWei = true) => {
    const id = Math.random();
    const title = `TUB: ${method} ${cup} ${value}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.basicActions,
                            `${this.methodSig(`${method}(address,bytes32,uint256)`)}${addressToBytes32(this.tubObj.address, false)}${toBytes32(cup, false)}${toBytes32(toWei ? web3.toWei(value) : value, false)}`,
                            log);
    } else {
      this.tubObj[method](toBytes32(cup), toWei ? web3.toWei(value) : value, {}, log);
    }
  }

  allowance = (token, dst) => {
    return new Promise((resolve, reject) => {
      this[`${token}Obj`].allowance.call(this.state.profile.activeProfile, this[`${dst}Obj`].address, (e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject(e);
        }
      });
    });
  }

  executeCallback = (args) => {
    const method = args.shift();
    this[method](...args);
  }

  checkAllowance = (token, dst, value, callback) => {
    let promise;
    let valueObj;
    if (token === 'gem') {
      valueObj = web3.toBigNumber(web3.toWei(value));
    } else {
      valueObj = web3.toBigNumber(2).pow(256).minus(1); // uint(-1)
    }

    promise = this.allowance(token, dst);

    Promise.resolve(promise).then((r) => {
      if (r.gte(valueObj)) {
        this.executeCallback(callback);
      } else {
        const tokenName = token.replace('gem', 'weth').replace('gov', 'mkr').toUpperCase();
        const action = {
          gem: {
            tub: 'Join'
          },
          skr: {
            tub: 'Exit/Lock',
            tap: 'Boom'
          },
          dai: {
            tub: 'Wipe/Shut',
            tap: 'Bust/Cash'
          },
          gov: {
            tub: 'Wipe/Shut'
          }
        }
        const id = Math.random();
        const title = `${tokenName}: approve ${action[token][dst]}${token === 'gem' ? ` ${value}` : ''}`;
        this.logRequestTransaction(id, title);
        const log = (e, tx) => {
          if (!e) {
            this.logPendingTransaction(id, tx, title, callback);
          } else {
            console.log(e);
            this.logTransactionRejected(id, title);
          }
        }
        this[`${token}Obj`].approve(this.state.system[dst].address, -1, {}, log);
      }
    });
  }

  updateValue = (value, token) => {
    const method = this.state.modal.method;
    const cup = this.state.modal.cup;
    let error = false;
    switch(method) {
      case 'proxy':
        const id = Math.random();
        const title = 'PROXY: create new profile';
        this.logRequestTransaction(id, title);
        this.proxyFactoryObj.build((e, tx) => {
          if (!e) {
            this.logPendingTransaction(id, tx, title);
            this.proxyFactoryObj.Created({ sender: this.state.network.defaultAccount }, { fromBlock: 'latest' }, (e, r) => {
              if (!e) {
                const profile = { ...this.state.profile }
                profile.proxy = r.args.proxy;
                this.setState({ profile }, () => {
                  this.changeMode();
                });
              } else {
                console.log(e);
              }
            });
          } else {
            console.log(e);
            this.logTransactionRejected(id, title);
          }
        });
      break;
      case 'open':
      case 'drip':
        this.executeMethod('tub', method);
        break;
      case 'shut':
        // We calculate debt with some margin before shutting cup (to avoid failures)
        const debt = this.tab(this.state.system.tub.cups[cup]).times(web3.fromWei(this.state.system.tub.tax).pow(120));
        if (this.state.system.dai.myBalance.lt(debt)) {
          error = `Not enough balance of DAI to shut CDP ${cup}.`;
        } else {
          const futureGovFee = web3.fromWei(wdiv(this.state.system.tub.fee, this.state.system.tub.tax)).pow(180).round(0); // 3 minutes of future fee
          const govDebt = wmul(wdiv(this.rap(this.state.system.tub.cups[cup]), this.state.system.pep.val), futureGovFee);
          if (govDebt.gt(this.state.system.gov.myBalance)) {
            error = `Not enough balance of MKR to shut CDP ${cup}.`;
          } else {
            if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
              this.executeMethodCup(method, cup);
            } else {
              this.checkAllowance('dai', 'tub', null, ['checkAllowance', 'gov', 'tub', null, ['executeMethodCup', method, cup]]);
            }
          }
        }
        break;
      case 'bite':
        this.executeMethodCup(method, cup);
        break;
      case 'join':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tub', method, value);
        } else {
          const valAllowanceJoin = web3.fromWei(web3.toBigNumber(value).times(this.state.system.tub.per).round().add(1).valueOf());
          this.checkAllowance('gem', 'tub', valAllowanceJoin, ['executeMethodValue', 'tub', method, value]);
        }
        break;
      case 'exit':
        value = this.state.system.tub.off === true ? web3.fromWei(this.state.system.skr.myBalance) : value;
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tub', method, value);
        } else {
          this.checkAllowance('skr', 'tub', null, ['executeMethodValue', 'tub', method, value]);
        }
        break;
      case 'boom':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tap', method, value);
        } else {
          this.checkAllowance('skr', 'tap', null, ['executeMethodValue', 'tap', method, value]);
        }
        break;
      case 'bust':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tap', method, value);
        } else {
          // const valueDAI = wmul(web3.toBigNumber(value), this.state.system.tub.avail_bust_ratio).ceil();
          this.checkAllowance('dai', 'tap', null, ['executeMethodValue', 'tap', method, value]);
        }
        break;
      case 'lock':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodCupValue(method, cup, value);
        } else {
          this.checkAllowance('skr', 'tub', null, ['executeMethodCupValue', method, cup, value]);
        }
        break;
      case 'free':
        if (this.state.system.tub.off) {
          this.executeMethodCupValue(method, cup, web3.fromWei(this.state.system.tub.cups[cup].avail_skr));
        } else {
          this.executeMethodCupValue(method, cup, value);
        }
        break;
      case 'draw':
        this.executeMethodCupValue(method, cup, value);
        break;
      case 'wipe':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodCupValue(method, cup, value);
        } else {
          this.checkAllowance('dai', 'tub', null, ['checkAllowance', 'gov', 'tub', null, ['executeMethodCupValue', method, cup, value]]);
        }
        break;
      case 'give':
        this.executeMethodCupValue(method, cup, value, false);
        break;
      case 'cash':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tap', method, web3.fromWei(this.state.system.dai.myBalance));
        } else {
          this.checkAllowance('dai', 'tap', null, ['executeMethodValue', 'tap', method, web3.fromWei(this.state.system.dai.myBalance)]);
        }
        break;
      case 'vent':
      case 'heal':
        this.executeMethod('tap', method);
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
    const tokenName = token.replace('gem', 'weth').replace('gov', 'mkr').toUpperCase();
    const id = Math.random();
    const title = `${tokenName}: transfer ${to} ${amount}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.tokenActions,
                            `${this.methodSig(`transfer(address,address,uint256)`)}${addressToBytes32(this[`${token}Obj`].address, false)}${addressToBytes32(to, false)}${toBytes32(web3.toWei(amount), false)}`,
                            log);
    } else {
      this[`${token}Obj`].transfer(to, web3.toWei(amount), {}, log);
    }
  }

  wrapUnwrap = (operation, amount) => {
    const id = Math.random();
    const title = `WETH: ${operation} ${amount}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (operation === 'wrap') {
      if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
        this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.tokenActions,
          `${this.methodSig(`deposit(address,uint256)`)}${addressToBytes32(this.gemObj.address, false)}${toBytes32(web3.toWei(amount), false)}`,
          log);
      } else {
        this.gemObj.deposit({ value: web3.toWei(amount) }, log);
      }
    } else if (operation === 'unwrap') {
      if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
        this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.tokenActions,
          `${this.methodSig(`withdraw(address,uint256)`)}${addressToBytes32(this.gemObj.address, false)}${toBytes32(web3.toWei(amount), false)}`,
          log);
      } else {
        this.gemObj.withdraw(web3.toWei(amount), {}, log);
      }
    }
  }

  approve = (token, dst, val) => {
    const tokenName = token.replace('gem', 'weth').replace('gov', 'mkr').toUpperCase();
    const action = {
      skr: {
        tub: 'Exit/Lock',
        tap: 'Boom'
      },
      dai: {
        tub: 'Wipe/Shut',
        tap: 'Bust/Cash'
      },
      gov: {
        tub: 'Wipe/Shut'
      }
    }
    const id = Math.random();
    const title = `${tokenName}: ${val ? 'approve': 'deny'} ${action[token][dst]}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.tokenActions,
        `${this.methodSig('approve(address,address,bool)')}${addressToBytes32(this[`${token}Obj`].address, false)}${addressToBytes32(this[`${dst}Obj`].address, false)}${toBytes32(val, false)}`,
        log);
    } else {
      this[`${token}Obj`].approve(this[`${dst}Obj`].address, val ? -1 : 0, (e, tx) => log(e, tx));
    }
  }

  approveAll = (val) => {
    const id = Math.random();
    const title = `SKR/DAI: ${val ? 'approve': 'deny'} all`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.customActions,
                            `${this.methodSig('approveAll(address,address,bool)')}${addressToBytes32(this.tubObj.address, false)}${addressToBytes32(this.tapObj.address, false)}${toBytes32(val, false)}`,
                            log);
    }
  }

  changeMode = () => {
    const profile = { ...this.state.profile };
    profile.mode = profile.mode !== 'proxy' ? 'proxy' : 'account';
    profile.activeProfile = profile.mode === 'proxy' ? profile.proxy : this.state.network.defaultAccount;
    profile.accountBalance = web3.toBigNumber(-1);
    if (profile.mode === 'proxy' && !web3.isAddress(profile.proxy)) {
      this.setState({ modal: { show: true, method: 'proxy' } });
    } else {
      this.setState({ profile }, () => {
        localStorage.setItem('mode', profile.mode);
        this.initContracts(this.state.system.top.address);
      });
    }
  }
  //

  renderMain() {
    const actions = {
      open: this.state.network.defaultAccount && this.state.system.tub.off === false,
      join: this.state.network.defaultAccount && this.state.system.tub.off === false && this.state.system.gem.myBalance.gt(0),
      exit: this.state.network.defaultAccount && this.state.system.skr.myBalance.gt(0)
                          && (this.state.system.tub.off === false ||
                             (this.state.system.tub.off === true && this.state.system.tub.out === true && this.state.system.sin.tubBalance.eq(0) && this.state.system.skr.tapBalance.eq(0))),
      bust: this.state.network.defaultAccount && this.state.system.tub.off === false && this.state.system.tub.avail_bust_dai && this.state.system.tub.avail_bust_dai.gt(0),
      boom: this.state.network.defaultAccount && this.state.system.tub.off === false && this.state.system.tub.avail_boom_dai && this.state.system.tub.avail_boom_dai.gt(0),
      heal: this.state.system.dai.tapBalance.gt(0),
      drip: this.state.system.tub.off === false
    };

    const helpers = {
      open: 'Open a new CDP',
      join: 'Exchange ETH for SKR',
      exit: 'Exchange SKR for ETH',
      boom: 'Buy DAI with SKR',
      bust: 'Buy SKR with DAI',
      heal: '',
      drip: ''
    };

    if (this.state.system.tub.off === true) {
      actions.cash = this.state.system.dai.myBalance.gt(0);
      actions.vent = this.state.system.skr.tapBalance.gt(0);
      helpers.cash = 'Exchange your DAI for ETH at the cage price';
      helpers.vent = 'Clean up the CDP state after cage';
    }

    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            <a href="/" className="logo"><img src={ logo } alt="Maker Dai Explorer" width="50" /> - DAI Explorer</a>
          </h1>
          {
            settings.chain[this.state.network.network].proxyFactory
            ?
              <div className="onoffswitch mode-box">
                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitchpMode" checked={ this.state.profile.mode === 'proxy' } onChange={ this.changeMode } />
                <label className="onoffswitch-label" htmlFor="myonoffswitchpMode">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
              </div>
            :
              ''
          }
        </section>
        <section className="content">
          <div>
            <div className="row">
              <div className="col-md-12">
                <GeneralInfo dai={ this.state.system.dai.address } top={ this.state.system.top.address } tub={ this.state.system.tub.address } tap={ this.state.system.tap.address } vox={ this.state.system.vox.address } network={ this.state.network.network } account={ this.state.network.defaultAccount } proxy={ this.state.profile.proxy }
                  initContracts={this.initContracts} />
              </div>
            </div>
            <div className="row">
              <Token system={ this.state.system } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='gem' color='' off={ this.state.system.tub.off } />
              <Token system={ this.state.system } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='gov' color='' off={ this.state.system.tub.off } />
              <Token system={ this.state.system } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='skr' color='bg-aqua' />
              <Token system={ this.state.system } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='dai' color='bg-green' />
              {/* <Token system={ this.state.system } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='sin' color='bg-red' /> */}
            </div>
            <div className="row">
              <div className="col-md-9 main">
                {
                  settings.chain[this.state.network.network].service
                  ? <Stats stats={ this.state.system.stats } />
                  : ''
                }
                {
                  settings.chain[this.state.network.network].service && settings.chain[this.state.network.network].chart
                  ? <PriceChart chartData={ this.state.system.chartData } />
                  : ''
                }
                <SystemStatus system={ this.state.system } />
                {
                  web3.isAddress(this.state.network.defaultAccount)
                  ?
                    <div className="row">
                      <div className="col-md-6">
                        <Wrap wrapUnwrap={ this.wrapUnwrap } accountBalance={ this.state.profile.accountBalance } system={ this.state.system } />
                      </div>
                      <div className="col-md-6">
                        <Transfer transferToken={ this.transferToken } system={ this.state.system } profile={ this.state.profile } network={ this.state.network.network } account={ this.state.network.defaultAccount } />
                      </div>
                    </div>
                  :
                    ''
                }
                <Cups system={ this.state.system } network={ this.state.network.network } profile={ this.state.profile.activeProfile } handleOpenModal={ this.handleOpenModal } handleOpenCupHistoryModal={ this.handleOpenCupHistoryModal } tab={ this.tab } rap={ this.rap } all={ (this.state.params && this.state.params[0] && this.state.params[0] === 'all') || !web3.isAddress(this.state.network.defaultAccount) } />
              </div>
              <div className="col-md-3 right-sidebar">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">General Actions</h3>
                  </div>
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        {
                          Object.keys(actions).map(key =>
                            <span key={ key } style={ {textTransform: 'capitalize'} }>
                              { actions[key] ? <a href="#action" data-method={ key } onClick={ this.handleOpenModal } title={ helpers[key] }>{ key }</a> : <span title={ helpers[key] }>{ key.substr(0,1).toUpperCase() + key.substr(1) }</span> }
                              { Object.keys(actions).pop() !== key ? <span> / </span> : '' }
                            </span>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <a className="resource buy-dai" href="https://oasisdex.com" target="_blank" rel="noopener noreferrer" >
                  <span>Buy DAI</span>
                </a>
                {
                  this.state.network.defaultAccount
                  ? <TokenAllowance system={ this.state.system } mode={ this.state.profile.mode } approve={ this.approve } approveAll={ this.approveAll } />
                  : ''
                }
                {
                  this.state.system.pip.address && this.state.network.network !== 'private' &&
                  <FeedValue address={ this.state.system.pip.address } pipVal={ this.state.system.pip.val } />
                }
                <ResourceButtons handleOpenVideoModal={ this.handleOpenVideoModal } handleOpenTerminologyModal={ this.handleOpenTerminologyModal } />
              </div>
            </div>
          </div>
          <TermsModal modal={ this.state.termsModal } markAsAccepted={ this.markAsAccepted } />
          <VideoModal modal={ this.state.videoModal } termsModal={ this.state.termsModal } handleCloseVideoModal={ this.handleCloseVideoModal } />
          <TerminologyModal modal={ this.state.terminologyModal } handleCloseTerminologyModal={ this.handleCloseTerminologyModal } />
          <CupHistoryModal modal={ this.state.cupHistoryModal } handleCloseCupHistoryModal={ this.handleCloseCupHistoryModal } network={ this.state.network.network } />
          <Modal system={ this.state.system } modal={ this.state.modal } updateValue={ this.updateValue } handleCloseModal={ this.handleCloseModal } tab={ this.tab } rap={ this.rap } proxyEnabled={ this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy) } />
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
