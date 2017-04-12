import React, { Component } from 'react';
import ReactModal from 'react-modal';

class Modal extends Component {
  updateValue = (e) => {
    e.preventDefault();
    const value = this.updateVal !== 'undefined' && this.updateVal && typeof this.updateVal.value !== 'undefined' ? this.updateVal.value : false;

    this.props.updateValue(value);

    if (typeof this.updateValueForm !== 'undefined' && this.updateValueForm) {
      this.updateValueForm.reset();
    }
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
        <input ref={(input) => this.updateVal = input} type={type} required />
        <input type="submit" />
      </form>
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
      case 'join':
        text = 'Please set amount of GEM (W-ETH) you want to convert to collateral (SKR).<br />' + 
               'You might be requested for signing two transactions if there is not enough allowance in GEM to complete this transaction.';
        type = 'number';
        style.content.height = '200px';
        break;
      case 'exit':
        text = 'Please set amount of collateral (SKR) you want to convert to GEM (W-ETH).<br />' + 
               'You might be requested for signing two transactions if there is not enough allowance in SKR to complete this transaction.';
        type = 'number';
        style.content.height = '200px';
        break;
      case 'lock':
        text = `Please set amount of collateral (SKR) you want to lock in CUP ${modal.cup}.<br />` +
               'You might be requested for signing two transactions if there is not enough allowance in SKR to complete this transaction.';
        type = 'number';
        style.content.height = '200px';
        break;
      case 'free':
        text = `Please set amount of collateral (SKR) you want to withdraw from CUP ${modal.cup}`;
        type = 'number';
        break;
      case 'draw':
        text = `Please set amount of locked collateral (SKR) in CUP ${modal.cup} that you want use to generate SAI`;
        type = 'number';
        break;
      case 'wipe':
        text = `Please set amount of collateral (SKR) you want to recover burning SAI in CUP ${modal.cup}.<br />`;
               'You might be requested for signing two transactions if there is not enough allowance in SAI to complete this transaction.';
        type = 'number';
        style.content.height = '200px';
        break;
      case 'give':
        text = `Please set the new address to be owner of CUP ${modal.cup}`;
        type = 'text';
        break;
      default:
        break;
    }

    return (
      <ReactModal
          isOpen={ modal.show }
          contentLabel="Action Modal"
          style={ style } >
        <a href="#" className="close" onClick={ this.props.handleCloseModal }>X</a>
        <br />
        <div>
          <p dangerouslySetInnerHTML={{__html: text}} />
          { type === 'yesno' ? this.renderYesNoForm() : this.renderInputForm(type) }
        </div>
      </ReactModal>
    )
  }
}

export default Modal;
