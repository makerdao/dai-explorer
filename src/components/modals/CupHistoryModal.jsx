import React, { Component } from 'react';
import ReactModal from 'react-modal';

class CupHistoryModal extends Component {
  render() {
    const style = {
      overlay: {
        backgroundColor : 'rgba(0, 0, 0, 0.5)'
      },
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
          isOpen={ this.props.modal.show }
          contentLabel="Action Modal"
          style={ style } >
        <div id="termsWrapper">
          <h2>CDP History</h2>
          {/* <div className="content" ref="termsContent">
            <table>
              <thead>
                <tr>
                  <th>
                    Action
                  </th>
                  <th>
                    Called by
                  </th>
                  <th>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div> */}
        </div>
      </ReactModal>
    )
  }
}

export default CupHistoryModal;
