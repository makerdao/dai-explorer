import React, { Component } from 'react';
import web3 from '../web3';

class Transfer extends Component {
  render() {
    return (
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Transfer</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-md-12">
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Transfer;