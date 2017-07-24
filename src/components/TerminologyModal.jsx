import React from 'react';
import ReactModal from 'react-modal';

const TerminologyModal = (props) => {
  const style = {
    content: {
      border: 1,
      borderStyle: 'solid',
      borderRadius: '4px',
      borderColor: '#d2d6de',
      bottom: 'auto',
      height: '80%',  // set height
      left: '50%',
      padding: '2rem',
      position: 'fixed',
      right: 'auto',
      top: '50%', // start from center
      transform: 'translate(-50%,-50%)', // adjust top "up" based on height
      width: '70%',
      maxWidth: '800px',
      overflow: 'hidden'
    }
  };

  return (
    <ReactModal
        isOpen={ props.modal.show }
        contentLabel="Action Modal"
        style={ style } >
      <a href="#action" className="close" onClick={ props.handleCloseTerminologyModal }>X</a>
      <div className="terminology-container">
        
      </div>
    </ReactModal>
  )
}

export default TerminologyModal;
