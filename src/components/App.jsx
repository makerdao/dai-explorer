import React, { Component } from 'react';
import NoConnection from './NoConnection';
import TermsModal from './modals/TermsModal';
import Modal from './modals/Modal';
import VideoModal from './modals/VideoModal';
import TerminologyModal from './modals/TerminologyModal';
import CupHistoryModal from './modals/CupHistoryModal';
import Token from './Token';
import GeneralInfo from './GeneralInfo';
import Faucet from './Faucet';
import PriceChart from './PriceChart';
import Stats from './Stats';
import SystemStatus from './SystemStatus';
import Cups from './Cups';
import Wrap from './Wrap';
import Transfer from './Transfer';
import FeedValue from './FeedValue';
import ResourceButtons from './ResourceButtons';
import Lpc from './Lpc';
import web3, { initWeb3 } from  '../web3';
import ReactNotify from '../notify';
import { WAD, toBytes32, fromRaytoWad, wmul, wdiv, etherscanTx } from '../helpers';
import logo from '../makerdao.svg';
import './App.css';

const settings = require('../settings');

const tub = require('../abi/tub');
const jar = require('../abi/saijar');
const top = require('../abi/top');
const tap = require('../abi/tap');
const tip = require('../abi/tip');
const dsethtoken = require('../abi/dsethtoken');
const dstoken = require('../abi/dstoken');
const dsvalue = require('../abi/dsvalue');
const dsroles = require('../abi/dsroles');
const lpc = require('../abi/sailpc');

class App extends Component {
  constructor() {
    super();
    const initialState = this.getInitialState();
    this.state = {
      ...initialState,
      network: {
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
          avail_boom_skr: web3.toBigNumber(-1),
          avail_boom_sai: web3.toBigNumber(-1),
          avail_bust_skr: web3.toBigNumber(-1),
          avail_bust_sai: web3.toBigNumber(-1),
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
        },
        whitelisted: true,
        chartData: {
          ethusd: {},
          skreth: {},
          saiusd: {},
          ethsai: {},
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

    const addrs = settings.chain[this.state.network.network];

    const saiState = { ...this.state.sai };
    saiState['whitelisted'] = settings.chain[this.state.network.network]['whitelisted'];
    this.setState({ sai: saiState });

    this.initContracts(addrs['top'], addrs['lpc']);
  }

  checkAccounts = () => {
    web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        const networkState = { ...this.state.network };
        networkState['accounts'] = accounts;
        networkState['defaultAccount'] = accounts[0];
        web3.eth.defaultAccount = networkState['defaultAccount'];
        this.setState({ network: networkState }, () => {
          if (web3.isAddress(this.state.network.defaultAccount)) {
            web3.eth.getBalance(this.state.network.defaultAccount, (e, r) => {
              const networkState = { ...this.state.network };
              networkState['accountBalance'] = r;
              this.setState({ network: networkState }, () => {
                this.checkUserAuth();
              });
            });
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
    this.checkAccounts();

    this.setHashParams();
    window.onhashchange = () => {
      this.setHashParams();
      this.initContracts(this.state.sai.top.address, this.state.sai.lpc.address);
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

  validateAddresses = (topAddress, lpcAddress) => {
    return web3.isAddress(topAddress) && (web3.isAddress(lpcAddress) || lpcAddress === '' || lpcAddress === null);
  }

  initContracts = (topAddress, lpcAddress) => {
    if (!this.validateAddresses(topAddress, lpcAddress)) {
      return;
    }
    web3.reset(true);
    const initialState = this.getInitialState();
    this.setState({
      ...initialState
    }, () => {
      // We need to verify that tap and top correspond to the tub
      window.topObj = this.topObj = this.loadObject(top.abi, topAddress);
      window.lpcObj = this.lpcObj = this.loadObject(lpc.abi, lpcAddress);

      const setUpPromises = [this.getTubAddress(), this.getTapAddress()];
      Promise.all(setUpPromises).then((r) => {
        if (r[0] && r[1] && web3.isAddress(r[0]) &&web3.isAddress(r[1])) {
          window.tubObj = this.tubObj = this.loadObject(tub.abi, r[0]);
          window.tapObj = this.tapObj = this.loadObject(tap.abi, r[1]);
          const sai = { ...this.state.sai };

          sai['whitelisted'] = settings.chain[this.state.network.network]['whitelisted'];
          sai['top'].address = topAddress;
          sai['lpc'].address = lpcAddress;
          sai['tub'].address = r[0];
          sai['tap'].address = r[1];

          this.setState({ sai }, () => {
            const promises = [this.setUpJar(), this.setUpTip()];
            Promise.all(promises).then((r) => {
              this.initializeSystemStatus();

              this.setUpLPS();
              const promises2 = [this.setUpPot(), this.setUpPit()];
              Promise.all(promises2).then((r) => {
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
                      this.getParameterFromTip('era')
                      ];
    Promise.all(promises).then((r) => {
      if (r[0] === true && r[1] === true && this.state.sai.tub.tax.gte(0) && this.state.sai.sin.potBalance.gte(0)) {
        this.setState((prevState, props) => {
          const sai = {...prevState.sai};
          const sin = {...sai.sin};
          sin.issuerFee = sai.sin.potBalance.times(web3.fromWei(sai.tub.tax).pow(sai.tip.era.minus(sai.tub.rho))).minus(sai.sin.potBalance).round(0);
          sai.sin = sin;
          return { sai };
        });
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
        if (!e) {
          if (r) {
            this.setState((prevState, props) => {
              const sai = {...prevState.sai};
              const tub = {...sai.tub};
              tub.role = 'root';
              sai.tub = tub;
              return { sai };
            });
          } else {
             this.rolesObj.hasUserRole.call(this.state.network.defaultAccount, 1, (e2, r2) => {
               if (!e2) {
                this.setState((prevState, props) => {
                  const sai = {...prevState.sai};
                  const tub = {...sai.tub};
                  tub.role = r2 ? 'user' : 'public';
                  sai.tub = tub;
                  return { sai };
                });
               }
             });
          }
        }
      })
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

  setUpJar = () => {
    const p = new Promise((resolve, reject) => {
      this.tubObj.jar((e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const jar = {...sai.jar};
            jar.address = r;
            sai.jar = jar;
            return { sai };
          }, () => {
            window.jarObj = this.jarObj = this.loadObject(jar.abi, r);
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
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const tip = {...sai.tip};
            tip.address = r;
            sai.tip = tip;
            return { sai };
          }, () => {
            window.tipObj = this.tipObj = this.loadObject(tip.abi, r);
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
    const p = new Promise((resolve, reject) => {
      this.tubObj.pot((e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const pot = {...sai.pot};
            pot.address = r;
            sai.pot = pot;
            return { sai };
          }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      })
    });
    return p;
  }

  setUpPit = (object) => {
    const p = new Promise((resolve, reject) => {
      this.tubObj.pit((e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const pit = {...sai.pit};
            pit.address = r;
            sai.pit = pit;
            return { sai };
          }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      })
    });
    return p;
  }

  setUpLPS = () => {
    if (this.lpcObj.address) {
      this.lpcObj.lps((e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const lps = {...sai.lps};
            lps.address = r;
            sai.lps = lps;
            return { sai };
          }, () => {
            window.lpsObj = this.lpsObj = this.loadObject(dstoken.abi, this.state.sai.lps.address);
            this.getDataFromToken('lps');
            this.setFilterToken('lps');
          });
        }
      });
    }
  }

  setUpToken = (token) => {
    this.tubObj[token]((e, r) => {
      if (!e) {
        this.setState((prevState, props) => {
          const sai = {...prevState.sai};
          const tok = {...sai[token]};
          tok.address = r;
          sai[token] = tok;
          return { sai };
        }, () => {
          window[`${token}Obj`] = this[`${token}Obj`] = this.loadObject(token === 'gem' ? dsethtoken.abi : dstoken.abi, r);
          this.getDataFromToken(token);
          this.setFilterToken(token);
        });
      }
    })
  }

  setFilterToken = (token) => {
    const filters = ['Transfer', 'LogNoteMint', 'LogNoteBurn'];

    if (token === 'gem') {
      filters.push('Deposit');
      filters.push('Withdrawal');
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
        this.getCup(r.args['cup'], address);
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
    if (settings.chain[this.state.network.network]['service']) {
      Promise.resolve(this.getFromService('cups', conditions, { cupi:'desc' })).then((response) => {
        response.results.forEach(function (v) {
          me.getCup(toBytes32(v.cupi), address);
        });
        me.getCupsFromChain(address, conditions, response.last_block);
      }).catch((error) => {
        me.getCupsFromChain(address, conditions, settings.chain[this.state.network.network]['fromBlock']);
      });
    } else {
      this.getCupsFromChain(address, conditions, settings.chain[this.state.network.network]['fromBlock']);
    }

    const cupSignatures = [
      'lock(bytes32,uint128)',
      'free(bytes32,uint128)',
      'draw(bytes32,uint128)',
      'wipe(bytes32,uint128)',
      'bite(bytes32)',
      'shut(bytes32)',
      'give(bytes32,address)',
    ].map((v) => this.methodSig(v));

    this.tubObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
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
    this.tapObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('jump(uint128)')) {
          this.getParameterFromTap('gap', false, this.getBoomBustValues());
        }
      }
    });
  }

  setFiltersTip = () => {
    this.tipObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('coax(uint128)')) {
          this.getParameterFromTip('way', true);
        }
      }
    });
  }

  setFiltersJar = () => {
    this.jarObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('jump(uint128)')) {
          this.getParameterFromJar('gap');
        }
      }
    });
  }

  setFiltersLpc = () => {
    if (this.lpcObj.address) {
      this.lpcObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
        if (!e) {
          this.logTransactionConfirmed(r.transactionHash);
          if (r.args.sig === this.methodSig('jump(uint128)')) {
            this.getParameterFromLpc('gap');
          }
        }
      });
    }
  }

  setFilterFeedValue = () => {
    this.jarObj.pip.call((e, r) => {
      if (!e) {
        this.setState((prevState, props) => {
          const sai = {...prevState.sai};
          const pip = {...sai.pip};
          pip.address = r;
          sai.pip = pip;
          return { sai };
        }, () => {
          window.pipObj = this.pipObj = this.loadObject(dsvalue.abi, r);
          this.getValFromPip();

          this.pipObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
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
        });
      }
    })
  }

  getDataFromToken = (token) => {
    this.getTotalSupply(token);

    if (token !== 'lps') {
      this.getParameterFromLpc('pie');
      this.getParameterFromLpc('gap');
      this.getParameterFromLpc('per', true);
    }
    if (token !== 'sin') {
      this.getBalanceOf(token, this.state.network.defaultAccount, 'myBalance');
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
        this.setState((prevState, props) => {
          const sai = {...prevState.sai};
          const tok = {...sai[name]};
          tok.totalSupply = r;
          sai[name] = tok;
          return { sai };
        }, () => {
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
        this.setState((prevState, props) => {
          const sai = {...prevState.sai};
          const tok = {...sai[name]};
          tok[field] = r;
          sai[name] = tok;
          return { sai };
        }, () => {
          if ((name === 'skr' || name === 'sai') && field === 'jarBalance') {
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
    if (settings.chain[this.state.network.network]['service']) {
      if (settings.chain[this.state.network.network]['chart']) {
        this.getChartData();
      }
      this.getStats();
    }
  }

  calculateSafetyAndDeficit = () => {
    if (this.state.sai.tub.mat.gte(0) && this.state.sai.skr.jarBalance.gte(0) && this.state.sai.jar.tag.gte(0) && this.state.sai.sin.totalSupply.gte(0)) {
      this.setState((prevState, props) => {
        const sai = {...prevState.sai};
        const tub = {...sai.tub};

        const pro = wmul(sai.skr.jarBalance, sai.jar.tag);
        const con = sai.sin.totalSupply;
        tub.eek = pro.lt(con);

        const min = wmul(con, tub.mat);
        tub.safe = pro.gte(min);

        sai.tub = tub;
        return { sai };
      });
    }
  }

  getParameterFromTub = (field, ray = false, callback = false) => {
    const p = new Promise((resolve, reject) => {
      this.tubObj[field].call((e, value) => {
        if (!e) {
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const tub = {...sai.tub};
            tub[field] = ray ? fromRaytoWad(value) : value;
            sai.tub = tub;
            return { sai };
          }, () => {
            this.getBoomBustValues();
            Object.keys(this.state.sai.tub.cups).map(key =>
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
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const jar = {...sai.jar};
            jar[field] = ray ? fromRaytoWad(value) : value;
            sai.jar = jar;
            return { sai };
          }, () => {
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
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const tap = {...sai.tap};
            tap[field] = ray ? fromRaytoWad(value) : value;
            sai.tap = tap;
            return { sai };
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

  getParameterFromTip = (field, ray = false) => {
    const p = new Promise((resolve, reject) => {
      this.tipObj[field].call((e, value) => {
        if (!e) {
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const tip = {...sai.tip};
            tip[field] = ray ? fromRaytoWad(value) : value;
            sai.tip = tip;
            return { sai };
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

  getParameterFromLpc = (field, ray = false) => {
    if (this.lpcObj.address) {
      this.lpcObj[field].call((e, value) => {
        if (!e) {
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const lpc = {...sai.lpc};
            lpc[field] = ray ? fromRaytoWad(value) : value;
            sai.lpc = lpc;
            return { sai };
          });
        }
      });
    }
  }

  getValFromPip = (field) => {
    const p = new Promise((resolve, reject) => {
      this.pipObj.read.call((e, value) => {
        if (!e) {
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const pip = {...sai.pip};
            pip.val = web3.toBigNumber(parseInt(value, 16));
            sai.pip = pip;
            return { sai };
          }, () => {
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
    if (this.state.sai.sai.pitBalance.gte(0)
        && this.state.sai.sin.issuerFee.gte(0)
        && this.state.sai.sin.pitBalance.gte(0)
        && this.state.sai.tip.par.gte(0)
        && this.state.sai.jar.tag.gte(0)
        && this.state.sai.tap.gap.gte(0)
        && this.state.sai.pip.val.gte(0)
        && this.state.sai.skr.pitBalance.gte(0)
        && this.state.sai.sin.potBalance.gte(0)
        && this.state.sai.tub.tax.gte(0)
        && this.state.sai.skr.pitBalance.gte(0)
        && this.state.sai.skr.totalSupply.gte(0)
        && this.state.sai.gem.jarBalance.gte(0)) {
      this.setState((prevState, props) => {
        const sai = {...prevState.sai};
        const tub = {...sai.tub};

        const dif = sai.sai.pitBalance.add(sai.sin.issuerFee).minus(sai.sin.pitBalance);
        // console.log('dif', dif.valueOf());
        tub.avail_boom_sai = tub.avail_boom_skr = web3.toBigNumber(0);
        tub.avail_bust_sai = tub.avail_bust_skr = web3.toBigNumber(0);

        if (dif.gt(0)) {
          // We can boom
          tub.avail_boom_sai = dif;
          tub.avail_boom_skr = wdiv(wdiv(wmul(tub.avail_boom_sai, sai.tip.par), sai.jar.tag), WAD.times(2).minus(sai.tap.gap));
        }

        if (sai.skr.pitBalance.gt(0) || dif.lt(0)) {
          // We can bust

          // This is a margin we need to take into account as bust quantity goes down per second
          const futureFee = sai.sin.potBalance.times(web3.fromWei(tub.tax).pow(120)).minus(sai.sin.potBalance).round(0);
          const saiNeeded = dif.abs().minus(futureFee);
          const equivalentSKR = wdiv(wdiv(wmul(saiNeeded, sai.tip.par), sai.jar.tag), sai.tap.gap);

          if (sai.skr.pitBalance.gte(equivalentSKR)) {
            tub.avail_bust_skr = sai.skr.pitBalance;
            tub.avail_bust_ratio = wmul(wmul(wdiv(WAD, sai.tip.par), sai.jar.tag), sai.tap.gap);
            tub.avail_bust_sai = wmul(tub.avail_bust_skr, tub.avail_bust_ratio);
          } else {
            tub.avail_bust_sai = saiNeeded;
            // We need to consider the case where SKR needs to be minted generating a change in 'sai.jar.tag'
            tub.avail_bust_skr = wdiv(sai.skr.totalSupply.minus(sai.skr.pitBalance), wdiv(wmul(wmul(sai.pip.val, sai.tap.gap), sai.gem.jarBalance), wmul(tub.avail_bust_sai, sai.tip.par)).minus(WAD));
            tub.avail_bust_ratio = wdiv(tub.avail_bust_sai, tub.avail_bust_skr);
          }
        }
        sai.tub = tub;
        return { sai };
      });
    }
  }

  getCup = (idHex, address) => {
    this.tubObj.cups(idHex, (e, cupData) => {
      const id = parseInt(idHex, 16);
      const firstLoad = typeof this.state.sai.tub.cups[id] === 'undefined';
      if (!address || address === cupData[0]) {
        // This verification needs to be done as the cup could have been given or closed by the user
        this.setState((prevState, props) => {
          const sai = {...prevState.sai};
          const tub = {...sai.tub};
          const cups = {...tub.cups};
          const cup = {
            lad: cupData[0],
            art: cupData[1],
            ink: cupData[2],
            safe: firstLoad ? 'N/A' : cups[id]['safe']
          };
          cups[id] = cup;
          tub.cups = cups;
          sai.tub = tub;
          return { sai };
        }, () => {
          this.updateCup(id);
        });
      } else if(!firstLoad) {
        // This means was already in the collection but the user doesn't own it anymore (used 'give' or 'shut')
        delete this.state.sai.tub.cups[id];
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
        const sai = {...prevState.sai};
        const chartData = {...sai.chartData};
        chartData[key] = value;
        sai.chartData = chartData;
        return { sai };
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

  getSAIUSDPrice = (timestamps) => {
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
        Promise.resolve(this.setChartState('saiusd', finalResponse)).then(() => {
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
    // SAI/USD
    promises.push(this.getSAIUSDPrice(timestamps));
    // SKR/ETH
    this.getSKRETHPrice(timestamps);

    Promise.all(promises).then((r) => {
      if (r[0] && r[1]) {
        const ethsai = { results: [] };
        r[0].results.forEach((value, index) => {
          ethsai.results.push({
            date: value.date,
            open: value.open / r[1].results[index].open,
            high: value.high / r[1].results[index].high,
            low: value.low / r[1].results[index].low,
            close: value.close / r[1].results[index].close,
          });
        });
        this.setChartState('ethsai', ethsai);
      }
    }).catch((error) => {
    });
  }

  getStats = () => {
    Promise.resolve(this.getFromService('cupStats')).then((response) => {
      this.setState((prevState, props) => {
        const sai = {...prevState.sai};
        sai.stats = { error: false, results: response.results };
        return { sai };
      });
    }).catch((error) => {
      this.setState((prevState, props) => {
        const sai = {...prevState.sai};
        sai.stats = { error: true };
        return { sai };
      });
    });
  }

  tab = (art) => {
    return wmul(art, this.state.sai.tub.chi).round(0);
  }

  updateCup = (id) => {
    this.setState((prevState, props) => {
      const sai = {...prevState.sai};
      const tub = {...sai.tub};
      const cups = {...tub.cups};
      const cup = {...cups[id]};

      cup.pro = wmul(cup.ink, sai.jar.tag).round(0);
      cup.ratio = cup.pro.div(wmul(this.tab(cup.art), sai.tip.par));
      // This is to give a window margin to get the maximum value (as 'chi' is dynamic value per second)
      const marginTax = web3.fromWei(tub.tax).pow(120);
      cup.avail_sai = wdiv(cup.pro, wmul(tub.mat, sai.tip.par)).minus(this.tab(cup.art)).round(0).minus(1); // "minus(1)" to avoid rounding issues when dividing by mat (in the contract uses it multiplying on safe function)
      cup.avail_sai_with_margin = wdiv(cup.pro, wmul(tub.mat, sai.tip.par)).minus(this.tab(cup.art).times(marginTax)).round(0).minus(1);
      cup.avail_skr = cup.ink.minus(wdiv(wmul(wmul(this.tab(cup.art), tub.mat), sai.tip.par), sai.jar.tag)).round(0);
      cup.avail_skr_with_margin = cup.ink.minus(wdiv(wmul(wmul(this.tab(cup.art).times(marginTax), tub.mat), sai.tip.par), sai.jar.tag)).round(0);
      cup.liq_price = cup.ink.gt(0) && cup.art.gt(0) ? wdiv(wdiv(wmul(this.tab(cup.art), tub.mat), sai.jar.per), cup.ink) : web3.toBigNumber(0);

      cups[id] = cup;
      tub.cups = cups;
      sai.tub = tub;
      return { sai }
    }, () => {
      this.tubObj.safe['bytes32'](toBytes32(id), (e, safe) => {
        if (!e) {
          this.setState((prevState, props) => {
            const sai = {...prevState.sai};
            const tub = {...sai.tub};
            const cups = {...tub.cups};
            const cup = {...cups[id]};

            cup['safe'] = safe;

            cups[id] = cup;
            tub.cups = cups;
            sai.tub = tub;
            return { sai }
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
      if (settings.chain[this.state.network.network]['service']) {
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
  //

  // Actions
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
              this.logPendingTransaction(tx, `${token.replace('gem', 'weth')}: approve jar ${value}`, { method, cup, value });
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
          method === 'shut' ? this.executeMethodCup(method, cup) : this.executeMethodCupValue(method, cup, value);
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
          error = `Not enough balance of SAI to shut CDP ${cup}.`;
        } else {
          this.potAllowance('sai', method, cup, web3.fromWei(debt));
        }
        break;
      case 'bite':
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
        const valueSAI = wmul(web3.toBigNumber(value), this.state.sai.tub.avail_bust_ratio).ceil();
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
      case 'vent':
        this.executeMethod('top', method);
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

  wrapUnwrap = (operation, amount) => {
    if (operation === 'wrap') {
      this.gemObj.deposit({ value: web3.toWei(amount) }, (e, tx) => {
        if (!e) {
          this.logPendingTransaction(tx, `weth: ${operation} ${amount}`);
        } else {
          console.log(e);
        }
      });
    } else if (operation === 'unwrap') {
      this.gemObj.withdraw(web3.toWei(amount), {}, (e, tx) => {
        if (!e) {
          this.logPendingTransaction(tx, `weth: ${operation} ${amount}`);
        } else {
          console.log(e);
        }
      });
    }
  }
  //

  hasUserRights = () => {
    return web3.isAddress(this.state.network.defaultAccount) && (!this.state.sai.whitelisted || ['root', 'user'].indexOf(this.state.sai.tub.role) !== -1);
  }

  renderMain() {
    const actions = {
      open: this.hasUserRights() && this.state.sai.tub.reg.eq(0),
      join: this.hasUserRights() && this.state.sai.tub.reg.eq(0) && this.state.sai.gem.myBalance.gt(0),
      exit: this.hasUserRights() && this.state.sai.skr.myBalance.gt(0)
                          && (this.state.sai.tub.reg.eq(0) ||
                             (this.state.sai.tub.reg.eq(1) && this.state.sai.sin.potBalance.eq(0) && this.state.sai.skr.pitBalance.eq(0))),
      bust: this.hasUserRights() && this.state.sai.tub.reg.eq(0) && this.state.sai.tub.avail_bust_sai && this.state.sai.tub.avail_bust_sai.gt(0),
      boom: this.hasUserRights() && this.state.sai.tub.reg.eq(0) && this.state.sai.tub.avail_boom_sai && this.state.sai.tub.avail_boom_sai.gt(0),
    };

    const helpers = {
      open: 'Open a new CDP',
      join: 'Exchange ETH for SKR',
      exit: 'Exchange SKR for ETH',
      boom: 'Buy SAI with SKR',
      bust: 'Buy SKR with SAI',
    };

    if (this.state.sai.tub.reg.eq(1)) {
      actions.cash = this.hasUserRights() && this.state.sai.sai.myBalance.gt(0);
      actions.vent = this.hasUserRights() && this.state.sai.skr.pitBalance.gt(0);
      helpers.cash = 'Exchange your SAI for ETH at the cage price';
      helpers.vent = 'Clean up the CDP state after cage';
    }

    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            <a href="/" className="logo"><img src={ logo } alt="Maker Sai Explorer" width="50" /> - SAI Explorer</a>
          </h1>
        </section>
        <section className="content">
          <div>
            <div className="row">
              <div className="col-md-12">
                <GeneralInfo sai={ this.state.sai.sai.address } top={ this.state.sai.top.address } tub={ this.state.sai.tub.address } tap={ this.state.sai.tap.address } jar={ this.state.sai.jar.address } tip={ this.state.sai.tip.address } lpc={ this.state.sai.lpc.address } network={ this.state.network.network } account={ this.state.network.defaultAccount } role={ this.state.sai.tub.role }
                  initContracts={this.initContracts} />
              </div>
            </div>
            <div className="row">
              <Token sai={ this.state.sai } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='gem' color='' reg={ this.state.sai.tub.reg } />
              <Token sai={ this.state.sai } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='skr' color='bg-aqua' />
              <Token sai={ this.state.sai } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='sai' color='bg-green' />
              {/* <Token sai={ this.state.sai } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='sin' color='bg-red' /> */}
              {/*<Token sai={ this.state.sai } network={ this.state.network.network } account={ this.state.network.defaultAccount } token='lps' color='bg-blue' />*/}
            </div>
            <div className="row">
              <div className="col-md-9 main">
                {
                  settings.chain[this.state.network.network]['service']
                  ? <Stats stats={ this.state.sai.stats } />
                  : ''
                }
                {
                  settings.chain[this.state.network.network]['service'] && settings.chain[this.state.network.network]['chart']
                  ? <PriceChart chartData={ this.state.sai.chartData } />
                  : ''
                }
                <SystemStatus sai={ this.state.sai } />
                {
                  web3.isAddress(this.state.network.defaultAccount)
                  ?
                    <div className="row">
                      <div className="col-md-6">
                        <Wrap wrapUnwrap={ this.wrapUnwrap } accountBalance={ this.state.network.accountBalance } sai={ this.state.sai } />
                      </div>
                      <div className="col-md-6">
                        <Transfer transferToken={ this.transferToken } sai={ this.state.sai } />
                      </div>
                    </div>
                  :
                    ''
                }
                <Cups sai={ this.state.sai } network={ this.state.network } handleOpenModal={ this.handleOpenModal } handleOpenCupHistoryModal={ this.handleOpenCupHistoryModal } tab={ this.tab } all={ (this.state.params && this.state.params[0] && this.state.params[0] === 'all') || !web3.isAddress(this.state.network.defaultAccount) } hasUserRights={ this.hasUserRights } />
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
                              { actions[key] ? <a href="#action" data-method={ key } onClick={ this.handleOpenModal } title={ helpers[key] }>{ key }</a> : <span title={ helpers[key] }>{ key }</span> }
                              { Object.keys(actions).pop() !== key ? <span> / </span> : '' }
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
                {
                  this.state.sai.lpc.address &&
                  <Lpc state={ this.state } hasUserRights={ this.hasUserRights } handleOpenModal={ this.handleOpenModal } />
                }
                {
                  this.state.sai.pip.address && this.state.network.network !== 'private' &&
                  <FeedValue address={ this.state.sai.pip.address } pipVal={ this.state.sai.pip.val } />
                }
                <ResourceButtons handleOpenVideoModal={ this.handleOpenVideoModal } handleOpenTerminologyModal={ this.handleOpenTerminologyModal } />
              </div>
            </div>
          </div>
          <TermsModal modal={ this.state.termsModal } markAsAccepted={ this.markAsAccepted } />
          <VideoModal modal={ this.state.videoModal } termsModal={ this.state.termsModal } handleCloseVideoModal={ this.handleCloseVideoModal } />
          <TerminologyModal modal={ this.state.terminologyModal } handleCloseTerminologyModal={ this.handleCloseTerminologyModal } />
          <CupHistoryModal modal={ this.state.cupHistoryModal } handleCloseCupHistoryModal={ this.handleCloseCupHistoryModal } network={ this.state.network.network } />
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
