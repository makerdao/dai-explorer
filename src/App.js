import React, { Component } from 'react';
import web3 from './web3';
import { toBytes32 } from './helpers';
import logo from './logo.svg';
import ReactModal from 'react-modal';
import AnimatedNumber from 'react-animated-number';
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
    modal: {
      show: false
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

  updateValue = (e) => {
    e.preventDefault();
    const method = this.state.modal.method;
    const cup = this.state.modal.cup;
    const value = typeof this.updateVal !== 'undefined' && typeof this.updateVal.value !== 'undefined' ? this.updateVal.value : false;

    if (!cup && !value) {
      this.tubObj[method]({ from: this.state.network.defaultAccount, gas: 4000000 }, (e, result) => {
        if (!e) {
          console.log(`${method} succeed`);
        } else {
          console.log(e);
        }
      });
    }
    else if (!cup) {
      this.tubObj[method](web3.toWei(value), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, result) => {
        if (!e) {
          console.log(`${method} ${value} succeed`);
        } else {
          console.log(e);
        }
      });
    }
    else if (!value) {
      console.log(method, cup);
      this.tubObj[method](toBytes32(cup), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, result) => {
        if (!e) {
          console.log(`${method} ${cup} succeed`);
        } else {
          console.log(e);
        }
      });
    } else {
      this.tubObj[method](toBytes32(cup), web3.toWei(value), { from: this.state.network.defaultAccount, gas: 4000000 }, (e, result) => {
        if (!e) {
          console.log(`${method} ${cup} ${value} succeed`);
        } else {
          console.log(e);
        }
      });
    }

    if (typeof this.updateValueForm !== 'undefined') {
      this.updateValueForm.reset();
    }

    this.setState({ modal: { show: false } });
  }

  // Start Render functions

  renderToken = (token, color) => {
    return (
      <div className="col-md-3 col-sm-6 col-xs-12">
        <div className="info-box">
          <span className={`info-box-icon ${color}`}>
            {token}
          </span>
          <div className="info-box-content">
            <span className="info-box-number">
              <span>Total</span><AnimatedNumber value={this.toNumber(this.state.sai[token].totalSupply)} stepPrecision={4}/>
            </span>
            <span className="info-box-number">
              <span>Yours</span><AnimatedNumber value={this.toNumber(this.state.sai[token].myBalance)} stepPrecision={4}/>
            </span>
            <span className="info-box-number">
              <span>Tub</span><AnimatedNumber value={this.toNumber(this.state.sai[token].tubBalance)} stepPrecision={4}/>
            </span>
            <span className="info-box-number">
              <span>Pot</span><AnimatedNumber value={this.toNumber(this.state.sai[token].potBalance)} stepPrecision={4}/>
            </span>
          </div>
        </div>
      </div>
    )
  }

  renderBiteAction = () => {
    return (
      <span>
        <a href="">Bite</a>/
      </span>
    )
  }

  renderOwnerCupActions = (cup) => {
    return (
      <span>
        <a href="#" data-method="lock" data-cup={ cup } onClick={ this.handleOpenModal }>Lock</a> -&nbsp;
        <a href="#" data-method="free" data-cup={ cup } onClick={ this.handleOpenModal }>Free</a> -&nbsp;
        <a href="#" data-method="draw" data-cup={ cup } onClick={ this.handleOpenModal }>Draw</a> -&nbsp;
        <a href="#" data-method="wipe" data-cup={ cup } onClick={ this.handleOpenModal }>Wipe</a> -&nbsp;
        <a href="#" data-method="shut" data-cup={ cup } onClick={ this.handleOpenModal }>Shut</a>
      </span>
    )
  }

  renderYesNoForm = () => {
    return (
      <form className="yesno">
        <button type="submit" onClick={(e) => this.updateValue(e)}>Yes</button>
        <button type="submit" onClick={(e) => this.handleCloseModal(e)}>No</button>
      </form>
    )
  }

  renderInputForm = () => {
    return (
      <form ref={(input) => this.updateValueForm = input} onSubmit={(e) => this.updateValue(e)}>
        <input ref={(input) => this.updateVal = input} type="number" required />
        <input type="submit" />
      </form>
    )
  }

  renderModal = () => {
    const style = {
      content: {
        border: 1,
        borderStyle: 'solid',
        borderRadius: '4px',
        borderColor: '#d2d6de',
        bottom: 'auto',
        height: '150px',  // set height
        left: '50%',
        padding: '2rem',
        position: 'fixed',
        right: 'auto',
        top: '50%', // start from center
        transform: 'translate(-50%,-50%)', // adjust top "up" based on height
        width: '40%',
        maxWidth: '40rem'
      }
    };
    return (
      <ReactModal
          isOpen={ this.state.modal.show }
          contentLabel="Action Modal"
          style={ style } >
        <a href="#" className="close" onClick={ this.handleCloseModal }>X</a>
        <br />
        <div>
          <p>{ this.state.modal.text }</p>
          { this.state.modal.type === 'yesno' ? this.renderYesNoForm() : this.renderInputForm() }
        </div>
      </ReactModal>
    )
  }

  renderCups = () => {
    return (
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
                  { (this.state.sai.tub.cups[key].owner === this.state.network.defaultAccount) ? this.renderOwnerCupActions(key) : '' }
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    )
  }

  renderTransfer = () => {
    return (
      <div>
        <form>
          <div>
            <label>Token</label>
            <select>
              <option value="gem">GEM</option>
              <option value="skr">SKR</option>
              <option value="sai">SAI</option>
            </select>
          </div>
          <div>
            <label>To</label>
            <input type="text" placeholder="0x" />
          </div>
          <input type="submit" />
        </form>
      </div>
    )
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
              { this.renderToken('gem', '') }
              { this.renderToken('skr', 'bg-aqua') }
              { this.renderToken('sai', 'bg-green') }
              { this.renderToken('sin', 'bg-red') }
            </div>
            <div className="row">
              <div className="col-md-9">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">SAI Status</h3>
                  </div>
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <table>
                          <thead>
                            <tr>
                              <th>SKR/ETH</th>
                              <th>USD/ETH</th>
                              <th>Liq. Ratio</th>
                              <th>Liq. Penalty</th>
                              <th>Debt Ceiling</th>
                              <th>Deficit</th>
                              <th>Safe</th>
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
                                <td>
                                  { this.state.sai.tub.eek ? 'YES' : 'NO' }
                                </td>
                                <td>
                                  { this.state.sai.tub.safe ? 'YES' : 'NO' }
                                </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
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
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">All Cups</h3>
                  </div>
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        { this.renderCups() }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">Transfer</h3>
                  </div>
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        { this.renderTransfer() }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          { this.renderModal() }
        </section>
      </div>
    );
  }

  renderNoConnection = () => {
    return (
      <div className="row">
      <div className="col-md-12">
        <div className="callout callout-warning">
          <h4>No connection to Ethereum</h4>
          <p>Please use Parity, Metamask or a local node at <strong>http://localhost:8545</strong></p>
        </div>
      </div>
    </div>
    );
  }

  render() {
    return (
      this.state.network.isConnected ? this.renderMain() : this.renderNoConnection()
    );
  }
}

export default App;
