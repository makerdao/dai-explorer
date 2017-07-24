import React from 'react';
import ReactModal from 'react-modal';

const VideoModal = (props) => {
  const style = {
    content: {
      border: 1,
      borderStyle: 'solid',
      borderRadius: '4px',
      borderColor: '#d2d6de',
      bottom: 'auto',
      height: 'auto',  // set height
      maxHeight: '95%',
      left: '50%',
      padding: '2rem',
      position: 'fixed',
      right: 'auto',
      top: '50%', // start from center
      transform: 'translate(-50%,-50%)', // adjust top "up" based on height
      width: '90%',
      overflow: 'hidden'
    }
  };

  return (
    <ReactModal
        isOpen={ props.modal.show }
        contentLabel="Action Modal"
        style={ style } >
      <a href="#action" className="close" onClick={ props.handleCloseVideoModal }>X</a>
      <div style={{ marginTop: '25px' }}>
        <div className="video-container">
          <iframe src="https://www.youtube.com/embed/5hZJ0Ot7Iuo" frameBorder="0" title="Sai Simple Stable Coin Dashboard" allowFullScreen></iframe>
        </div>
      </div>
    </ReactModal>
  )
}

export default VideoModal;
