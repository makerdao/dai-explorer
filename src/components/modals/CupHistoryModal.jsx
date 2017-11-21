import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { etherscanAddress, etherscanTx, printNumber, formatDate } from '../../helpers';

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
          <a href="#action" className="close" onClick={ this.props.handleCloseCupHistoryModal }>X</a>
          <h2>CDP { this.props.modal.id } History</h2>
            <div className="content" ref="termsContent">
              {
                this.props.modal.error
                ?
                  <div className="col-md-12 system-status">
                    <div>History is not available at this moment</div>
                  </div>
                :
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Date
                        </th>
                        <th>
                          Sender
                        </th>
                        <th>
                          Action
                        </th>
                        <th>
                          Value
                        </th>
                        <th>
                          Tx
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                      this.props.modal.actions && this.props.modal.actions.length > 0
                      ?
                        Object.keys(this.props.modal.actions).map(key =>
                          <tr key={ key }>
                            <td>
                              { formatDate(this.props.modal.actions[key].timestamp) }
                            </td>
                            <td>
                              { etherscanAddress(this.props.network, `${this.props.modal.actions[key].sender.substring(0,20)}...`, this.props.modal.actions[key].sender) }
                            </td>
                            <td>
                              { this.props.modal.actions[key].action }
                            </td>
                            <td className="text-right">
                              {
                                ['lock', 'free', 'draw', 'wipe'].indexOf(this.props.modal.actions[key].action) !== -1
                                ?
                                  printNumber(this.props.modal.actions[key].param)
                                :
                                  this.props.modal.actions[key].action === 'give'
                                  ? etherscanAddress(this.props.network, `${this.props.modal.actions[key].param.substring(0,20)}...`, this.props.modal.actions[key].param)
                                  : this.props.modal.actions[key].param
                              }
                              {
                                ['lock', 'free'].indexOf(this.props.modal.actions[key].action) !== -1
                                ?
                                  ' SKR'
                                :
                                  ['draw', 'wipe'].indexOf(this.props.modal.actions[key].action) !== -1
                                  ?
                                    ' DAI'
                                  :
                                    ''
                              }
                            </td>
                            <td>
                              { etherscanTx(this.props.network, `${this.props.modal.actions[key].transactionHash.substring(0,20)}...`, this.props.modal.actions[key].transactionHash) }
                            </td>
                          </tr>
                        )
                      :
                        ''
                      }
                    </tbody>
                  </table>
              }
          </div>
        </div>
      </ReactModal>
    )
  }
}

export default CupHistoryModal;
