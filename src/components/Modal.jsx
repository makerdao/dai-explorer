import React, { Component } from 'react';
import ReactModal from 'react-modal';
import web3 from  '../web3';

class Modal extends Component {
  updateValue = (e) => {
    e.preventDefault();
    const value = this.updateVal !== 'undefined' && this.updateVal && typeof this.updateVal.value !== 'undefined' ? this.updateVal.value : false;
    const token = this.token !== 'undefined' && this.token && typeof this.token.value !== 'undefined' ? this.token.value : false;

    this.props.updateValue(value, token);

    if (typeof this.updateValueForm !== 'undefined' && this.updateValueForm) {
      this.updateValueForm.reset();
    }
  }

  setMax = (e) => {
    e.preventDefault();
    let value = web3.toBigNumber(0);
    switch(this.props.modal.method) {
      case 'join':
        value = this.props.sai.gem.myBalance;
        break;
      case 'exit':
      case 'lock':
        value = this.props.sai.skr.myBalance;
        break;
      case 'free':
        value = this.props.sai.tub.cups[this.props.modal.cup].avail_skr;
        break;
      case 'draw':
        value = this.props.sai.tub.cups[this.props.modal.cup].avail_sai;
        break;
      case 'wipe':
        value = web3.BigNumber.min(this.props.sai.sai.myBalance, this.props.sai.tub.cups[this.props.modal.cup].art);
        break;
      case 'boom':
        value = this.props.sai.tub.avail_boom_skr;
        break;
      case 'bust':
        value = this.props.sai.tub.avail_bust_skr;
        break;
      case 'lpc-pool':
        value = this.props.sai[document.getElementById('selectToken').value].myBalance;
        break;
      case 'lpc-exit':
        value = this.props.sai.lps.myBalance && this.props.sai.lpc.per && this.props.sai.lpc.gap
                ? this.props.sai.lps.myBalance.times(web3.toBigNumber(10).pow(18)).div(this.props.sai.lpc.per)
                : value;
        value = !this.props.sai.lps.myBalance.eq(this.props.sai.lps.totalSupply)
                ? value.times(web3.toBigNumber(10).pow(18)).div(this.props.sai.lpc.gap)
                : value;
        if (document.getElementById('selectToken').value === 'sai') {
          value = web3.BigNumber.min(value, this.props.sai.sai.lpcBalance);
        } else if (document.getElementById('selectToken').value === 'gem') {
          value = this.props.sai.tub.tag.gt(0)
                  ? value.times(web3.toBigNumber(10).pow(18)).div(this.props.sai.tub.tag)
                  : value;
          value = web3.BigNumber.min(value, this.props.sai.gem.lpcBalance);
        }
        break;
      case 'lpc-take':
        if (document.getElementById('selectToken').value === 'sai') {
          value = this.props.sai.gem.myBalance.times(this.props.sai.tub.tag).div(this.props.sai.lpc.gap).round(0);
          value = web3.BigNumber.min(value, this.props.sai.sai.lpcBalance);
        } else if (document.getElementById('selectToken').value === 'gem') {
          value = this.props.sai.sai.myBalance.times(web3.toBigNumber(10).pow(36)).div(this.props.sai.tub.tag).div(this.props.sai.lpc.gap).round(0);
          value = web3.BigNumber.min(value, this.props.sai.gem.lpcBalance);
        }
        break;
      default:
        break;
    }
    document.getElementById('inputValue').value = web3.fromWei(value).valueOf();
  }

  renderYesNoForm = () => {
    return (
      <form className="yesno">
        <button type="submit" onClick={(e) => this.updateValue(e)}>Yes</button>
        <button type="submit" onClick={(e) => this.props.handleCloseModal(e)}>No</button>
      </form>
    )
  }

  renderInputForm = (type) => {
    return (
      <form ref={(input) => this.updateValueForm = input} onSubmit={(e) => this.updateValue(e)}>
        <input ref={(input) => this.updateVal = input} type={type} id="inputValue" required step="0.000000000000000001" />
        <a href="#action" onClick={ this.setMax }>Set max</a>
        <br /><br />
        <input type="submit" />
      </form>
    )
  }

  renderLPCForm = (type) => {
    return (
      <form ref={(input) => this.updateValueForm = input} onSubmit={(e) => this.updateValue(e)}>
        <select ref={(input) => this.token = input} id="selectToken">
          <option value="gem">GEM</option>
          <option value="sai">SAI</option>
        </select>
        <input ref={(input) => this.updateVal = input} type={type} id="inputValue" required step="0.000000000000000001" />
        <a href="#action" onClick={ this.setMax }>Set max</a>
        <br /><br />
        <input type="submit" />
      </form>
    )
  }

  renderError = (error) => {
    return (
      <p className="error">
        { error }
      </p>
    )
  }

  render() {
    const modal = this.props.modal;
    const style = {
      content: {
        border: 1,
        borderStyle: 'solid',
        borderRadius: '4px',
        borderColor: '#d2d6de',
        bottom: 'auto',
        height: '170px',  // set height
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

    let text = '';
    let type = '';
    switch(modal.method) {
      case 'open':
        text = 'Are you sure you want to open a new Cup?';
        type = 'yesno';
        break;
      case 'shut':
        text = `Are you sure you want to close Cup ${modal.cup}?`;
        type = 'yesno';
        break;
      case 'bite':
        text = `Are you sure you want to bite Cup ${modal.cup}?`;
        type = 'yesno';
        break;
      case 'join':
        text = 'Please set amount of GEM (W-ETH) you want to convert to collateral (SKR).<br />' + 
               'You might be requested for signing two transactions if there is not enough allowance in GEM to complete this transaction.';
        type = 'number';
        style.content.height = '230px';
        break;
      case 'exit':
        if (this.props.reg.eq(2)) {
          text = 'Are you sure you want to exit all your SKR?<br />' +
                 'You might be requested for signing two transactions if there is not enough allowance in SKR to complete this transaction.';
          type = 'yesno';
          style.content.height = '200px';
        } else {
          text = 'Please set amount of collateral (SKR) you want to convert to GEM (W-ETH).<br />' +
                 'You might be requested for signing two transactions if there is not enough allowance in SKR to complete this transaction.';
          type = 'number';
          style.content.height = '220px';
        }
        break;
      case 'boom':
        text = 'Please set amount of SKR you want to transfer to get SAI.<br />' +
               'You might be requested for signing two transactions if there is not enough allowance in SKR to complete this transaction.';
        type = 'number';
        style.content.height = '240px';
        break;
      case 'bust':
        text = 'Please set amount of SKR you want to get in exchange of SAI.<br />' +
               'You might be requested for signing two transactions if there is not enough allowance in SAI to complete this transaction.';
        type = 'number';
        style.content.height = '240px';
        break;
      case 'lock':
        text = `Please set amount of collateral (SKR) you want to lock in CUP ${modal.cup}.<br />` +
               'You might be requested for signing two transactions if there is not enough allowance in SKR to complete this transaction.';
        type = 'number';
        style.content.height = '240px';
        break;
      case 'free':
        text = `Please set amount of collateral (SKR) you want to withdraw from CUP ${modal.cup}`;
        type = 'number';
        break;
      case 'draw':
        text = `Please set amount of SAI you want to mint from your locked collateral (SKR) in CUP ${modal.cup}`;
        type = 'number';
        style.content.height = '190px';
        break;
      case 'wipe':
        text = `Please set amount of SAI you want to burn to recover your collateral (SKR) from CUP ${modal.cup}.<br />` +
               'You might be requested for signing two transactions if there is not enough allowance in SAI to complete this transaction.';
        type = 'number';
        style.content.height = '240px';
        break;
      case 'give':
        text = `Please set the new address to be owner of CUP ${modal.cup}`;
        type = 'text';
        break;
      case 'cash':
        text = 'Are you sure you want to cash?<br />'+
               'You might be requested for signing two transactions if there is not enough allowance in SAI to complete this transaction.';
        type = 'yesno';
        style.content.height = '200px';
        break;
      case 'bail':
        text = `Are you sure you want to bail Cup ${modal.cup}?`;
        type = 'yesno';
        break;
      case 'lpc-pool':
        text = `Please set the coin and amount you want to deposit in exchange of LPS`;
        type = 'lpc';
        break;
      case 'lpc-exit':
        text = `Please set the coin and amount you want to exit`;
        type = 'lpc';
        break;
      case 'lpc-take':
        text = `Please set the coin and amount you want to take`;
        type = 'lpc';
        break;
      default:
        break;
    }

    return (
      <ReactModal
          isOpen={ modal.show }
          contentLabel="Action Modal"
          style={ style } >
        <a href="#action" className="close" onClick={ this.props.handleCloseModal }>X</a>
        <br />
        <div>
          <p dangerouslySetInnerHTML={{__html: text}} />
          { type === 'lpc' ? this.renderLPCForm() : (type === 'yesno' ? this.renderYesNoForm() : this.renderInputForm(type)) }
          { modal.error ? this.renderError(modal.error) : '' }
        </div>
      </ReactModal>
    )
  }
}

export default Modal;
