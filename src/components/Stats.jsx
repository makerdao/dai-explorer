import React from 'react';
import web3 from  '../web3';
import { printNumber } from '../helpers';

const saveStorage = (e) => {
  localStorage.setItem('statsCollapsed', localStorage.getItem('statsCollapsed') === "true" ? false : true)
}

const Stats = (props) => {
  return (
    <div className="box collapsed">
      <div className="box-header with-border" data-toggle="collapse" data-parent="#accordion" href="#collapseStats" onClick={ saveStorage } aria-expanded={ localStorage.getItem('statsCollapsed') !== 'true' }>
        <h3 className="box-title">Stats</h3>
      </div>
      <div id="collapseStats" className={ `box-body panel-collapse collapse${localStorage.getItem('statsCollapsed') !== 'true' ? ' in' : ''}` } aria-expanded={ localStorage.getItem('statsCollapsed') !== 'true' } style={{ height: localStorage.getItem('statsCollapsed') !== 'true' ? "auto" : "0px" }}>
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
          }
        </div>
      </div>
    </div>
  )
}

export default Stats;