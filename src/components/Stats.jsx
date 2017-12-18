import React from 'react';
import web3 from  '../web3';
import { printNumber } from '../helpers';

const Stats = (props) => {
  return (
    <div style={ {marginTop: '15px', clear: 'left'} }>
      <div style={ {paddingLeft: '10px', fontSize: '16px'} }>
        <strong>Stats</strong>
      </div>
      {
        props.stats.error
        ?
          <div className="system-status">
            <div style={ {paddingLeft: '10px'} }>Stats are not available at this moment</div>
          </div>
        :
          <div className="system-status">
            <div>
              <div>
                <strong>CDPs Opened</strong>
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
                <strong>CDPS Closed</strong>
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
                <strong>Tot PETH Locked</strong>
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
                <strong>Tot PETH Freed</strong>
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
                <strong>Tot DAI Drawn</strong>
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
                <strong>Tot DAI Wiped</strong>
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
          </div>
        }
    </div>
  )
}

export default Stats;