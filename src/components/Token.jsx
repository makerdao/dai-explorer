import React from 'react';
import AnimatedNumber from '../AnimatedNumber';
import { formatNumber, copyToClipboard, etherscanToken } from '../helpers';

const Token = (props) => {
  const token = props.system[props.token];
  // const totalSupply = props.token === 'dai' || props.token === 'sin' ? token.totalSupply.add(props.system.sin.issuerFee) : token.totalSupply;
  // const tapBalance = props.token === 'dai' ? token.tapBalance.add(props.system.sin.issuerFee) : token.tapBalance;
  // const tubBalance = props.token === 'sin' ? token.tubBalance.add(props.system.sin.issuerFee) : token.tubBalance;
  const name = props.token.replace('gem', 'weth').replace('gov', 'mkr').replace('skr', 'peth').replace('dai', 'sai');
  const totalSupply = token.totalSupply;
  const tapBalance = token.tapBalance;
  const tubBalance = token.tubBalance;
  const tubBalanceLabel = props.token === 'gem' ? 'Total Pooled' : 'Total Locked';
  const tubBalanceDesc = props.token === 'gem' ? 'Amount of ETH in the PETH collateral pool' : 'Amount of PETH locked as collateral in CDPs';
  const tapBalanceLabel = props.token === 'gem' ? 'Redeemable' : (props.token === 'skr' ? 'Pending Sale' : (props.token === 'dai' ? 'Pending Sale' : 'Tap Balance'));
  const tapBalanceDesc = props.token === 'gem'
                          ? 'Amount of ETH available to cash for SAI'
                          : (props.token === 'skr'
                            ? 'Amount of PETH collateral pending liquidation via bust'
                            : (props.token === 'dai'
                              ? 'Amount of surplus SAI pending sale via boom'
                              : ''));
  return (
    <div className="col-md-6 col-sm-6 col-xs-12">
      <div className={ props.token === 'skr' || props.token === 'dai' ? 'info-box big' : 'info-box' }>
        <span className={`info-box-icon ${props.color}`}>
          { etherscanToken(props.network, name, token.address) }
        </span>
        <div className="info-box-content">
          {
            token.myBalance &&
            <span className="info-box-number">
              <span style={ { textDecoration: 'underline' } }>{ etherscanToken(props.network, 'Your Balance', token.address, props.account) }</span>
              {
                props.account
                ?
                  <AnimatedNumber
                    value={ token.myBalance }
                    title={ formatNumber(token.myBalance, 18) }
                    formatValue={ n => formatNumber(n, 3) }
                    className="printedNumber"
                    onClick = { copyToClipboard } />
                :
                  <span>N/A</span>
              }
            </span>
          }
          <span className="info-box-number">
            <span>{ etherscanToken(props.network, 'Total Supply', token.address) }</span>
            <AnimatedNumber
              value={ totalSupply }
              title={ formatNumber(totalSupply, 18) }
              formatValue={ n => formatNumber(n, 3) }
              className="printedNumber"
              onClick = { copyToClipboard } />
          </span>
          {
            token.tubBalance &&
            <span className="info-box-number">
              <span title={ tubBalanceDesc }>{ etherscanToken(props.network, tubBalanceLabel, token.address, props.system.tub.address) }</span>
              <AnimatedNumber
                value={ tubBalance }
                title={ formatNumber(tubBalance, 18) }
                formatValue={ n => formatNumber(n, 3) }
                className="printedNumber"
                onClick = { copyToClipboard } />
            </span>
          }
          {
            token.tapBalance && (props.token !== 'gem' || props.off === true) &&
            <span className="info-box-number">
              <span title={ tapBalanceDesc }>{ etherscanToken(props.network, tapBalanceLabel, token.address, props.system.tap.address) }</span>
              <AnimatedNumber
                value={ tapBalance }
                title={ formatNumber(tapBalance, 18) }
                formatValue={ n => formatNumber(n, 3) }
                className="printedNumber"
                onClick = { copyToClipboard } />
            </span>
          }
          {
            token.pitBalance &&
            <span className="info-box-number">
              <span title="Burner">{ etherscanToken(props.network, "Burner", token.address, props.system.pit.address) }</span>
              <AnimatedNumber
                value={ token.pitBalance }
                title={ formatNumber(token.pitBalance, 18) }
                formatValue={ n => formatNumber(n, 3) }
                className="printedNumber"
                onClick = { copyToClipboard } />
            </span>
          }
          {
            // Quick fix to align the action buttons:
            props.token === 'dai' &&
            <span className="info-box-number">
              &nbsp;
            </span>
          }
          {
            props.actions &&
            <div>
              {
                Object.keys(props.actions).map(key =>
                  props.actions[key].active
                  ? <a key={ key } className="buttonAction" title={ props.actions[key].helper } href="#action" data-method={ key } onClick={ props.handleOpenModal } ><span data-method={ key }>{ props.actions[key].display }</span></a>
                  : <span key={ key } className="buttonAction" title={ props.actions[key].helper }><span>{ props.actions[key].display }</span></span>
                )
              }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Token;
