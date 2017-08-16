import React from 'react';
import web3 from  '../web3';
import { printNumber } from '../helpers';

const Stats = (props) => {
  return (
    <div className="box">
      <div className="box-header with-border">
        <h3 className="box-title">Stats</h3>
      </div>
      <div className="box-body">
        <div className="row">
          {
          props.stats.error
          ?
            <div className="col-md-12 system-status">
              <div>Stats are not available at this moment</div>
            </div>
          :
            <div className="col-md-12 system-status">
              <div>
                <strong>CDPs opened</strong>
                <span>
                  {
                    props.stats.results
                    ?
                      props.stats.results.openCount
                    :
                      'Loading...'
                  }
                </span>
              </div>
              <div>
                <strong>CDPS closed</strong>
                <span>
                  {
                    props.stats.results
                    ?
                      props.stats.results.shutCount
                    :
                      'Loading...'
                  }
                </span>
              </div>
              <div>
                <strong>Bite Counter</strong>
                <span>
                  {
                    props.stats.results
                    ?
                      props.stats.results.biteCount
                    :
                      'Loading...'
                  }
                </span>
              </div>
              <div>
                <strong>Give Counter</strong>
                <span>
                  {
                    props.stats.results
                    ?
                      props.stats.results.giveCount
                    :
                      'Loading...'
                  }
                </span>
              </div>
              <div>
                <strong>Tot SKR Locked</strong>
                <span>
                  {
                    props.stats.results
                    ?
                      printNumber(web3.toBigNumber(props.stats.results.lockAmount))
                    :
                      'Loading...'
                  }
                </span>
              </div>
              <div>
                <strong>Tot SKR Freed</strong>
                <span>
                  {
                    props.stats.results
                    ?
                      printNumber(web3.toBigNumber(props.stats.results.freeAmount))
                    :
                      'Loading...'
                  }
                </span>
              </div>
              <div>
                <strong>Tot SAI Drawn</strong>
                <span>
                  {
                    props.stats.results
                    ?
                      printNumber(web3.toBigNumber(props.stats.results.drawAmount))
                    :
                      'Loading...'
                  }
                </span>
              </div>
              <div>
                <strong>Tot SAI Wiped</strong>
                <span>
                  {
                    props.stats.results
                    ?
                      printNumber(web3.toBigNumber(props.stats.results.wipeAmount))
                    :
                      'Loading...'
                  }
                </span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Stats;