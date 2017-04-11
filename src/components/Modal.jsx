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

  renderInputForm = () => {
    return (
      <form ref={(input) => this.updateValueForm = input} onSubmit={(e) => this.updateValue(e)}>
        <input ref={(input) => this.updateVal = input} type="number" required />
        <input type="submit" />
      </form>
    )
  }

  render() {
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
          isOpen={ this.props.modal.show }
          contentLabel="Action Modal"
          style={ style } >
        <a href="#" className="close" onClick={ this.props.handleCloseModal }>X</a>
        <br />
        <div>
          <p>{ this.props.modal.text }</p>
          { this.props.modal.type === 'yesno' ? this.renderYesNoForm() : this.renderInputForm() }
        </div>
      </ReactModal>
    )
  }
}

export default Modal;
