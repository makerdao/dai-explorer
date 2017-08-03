import React from 'react';
import ReactModal from 'react-modal';

const TerminologyModal = (props) => {
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
        isOpen={ props.modal.show }
        contentLabel="Action Modal"
        style={ style } >
      <div id="termsWrapper">
        <a href="#action" className="close" onClick={ props.handleCloseTerminologyModal }>X</a>
        <h2>Terminology</h2>
        <div className="content">
          <div>
            <strong>% Tot (SKR):</strong> The ratio of collateral SKR to total outstanding SKR.<br />
            <strong>% Ratio:</strong> The collateral ratio of the CDP.<br />
            <strong>Account:</strong> The user’s active ethereum account.<br />
            <strong>Avail. Sai (to draw):</strong> The maximum Sai that can currently be drawn from a CDP.<br />
            <strong>Avail. SKR (to free):</strong> The maximum SKR that can currently be released from a CDP.<br />
            <strong>Bite:</strong> Initiate liquidation of an undercollateralized CDP.<br />
            <strong>CDP Fee:</strong> CDP interest rate.<br />
            <strong>Collateral Auction:</strong> The auction selling collateral in a liquidated CDP. It is designed to prioritize covering the debt owed by the CDP, then to give the owner the best price possible for their collateral refund.<br />
            <strong>Collateralized Debt Position (CDP):</strong> A smart contract whose users receive an asset (Sai), which effectively operates as a debt instrument with an interest rate. The CDP user has posted collateral in excess of the value of the loan in order to guarantee their debt position.<br />
            <strong>Collateral Ratio:</strong> The ratio of the value of a CDP’s collateral to the value of its debt.<br />
            <strong>Debt Ceiling:</strong> The maximum number of SAI that can be issued.<br />
            <strong>Debt (Sai):</strong> The amount of outstanding SAI debt in a CDP.<br />
            <strong>Deficit:</strong> Whether the system is at less than 100% overall collateralisation.<br />
            <strong>Draw:</strong> Create Sai against a CDP.<br />
            <strong>ETH/USD:</strong> Price of 1 ETH in USD (as determined by the median of the feeds).<br />
            <strong>Exit:</strong> Exchange SKR for Ethereum.<br />
            <strong>Free:</strong> Remove collateral from a CDP.<br />
            <strong>Gap (boom/bust):</strong> The discount/premium relative to Sai target price at which the system buys/sells collateral SKR for SAI. When negative, collateral is being sold at a discount (under ‘bust’) and bought at a premium (under ‘boom’).<br />
            <strong>Give:</strong> Transfer CDP ownership.<br />
            <strong>Interest rate:</strong> Annual % change of Sai target price in USD. This represents Sai deflation or inflation when positive or negative, respectively.<br />
            <strong>Join:</strong> Exchange Ethereum for SKR.<br />
            <strong>Keepers:</strong> Independent economic actors that trade Sai, CDPs and/or MKR, create Sai or close CDPs and seek arbitrage opportunities in The Sai Stablecoin System and as a result help maintain Sai market rationality and price stability.<br />
            <strong>Liq. Penalty:</strong> The penalty charged by the system upon liquidation, as a percentage of the CDP collateral.<br />
            <strong>Liq. Ratio:</strong> The collateralization ratio below which a CDP may be liquidated.<br />
            <strong>Liquidation price:</strong> The Ethereum price at which a CDP will become unsafe and at risk of liquidation.<br />
            <strong>Lock:</strong> Add collateral to a CDP.<br />
            <strong>Locked (SKR):</strong> The amount of SKR collateral in a CDP.<br />
            <strong>Oracles:</strong> Ethereum accounts (contracts or users) selected to provide price feeds into various components of The Sai &amp; Sai Stablecoin System.<br />
            <strong>Risk Parameters:</strong> The stability fee, liquidation ratio, boom/bust gap, and debt ceiling.<br />
            <strong>Safe:</strong> Whether the overall collateralization of the system is above the liquidation ratio.<br />
            <strong>SAI/USD:</strong> Target price for 1 SAI in USD.<br />
            <strong>SKR:</strong> The token used as collateral in CDPs which represents a claim on the ETH collateral pool of the Sai Stablecoin System.<br />
            <strong>SKR/ETH:</strong> The price of 1 SKR in ETH.<br />
            <strong>Shut:</strong> Close a CDP - Wipe all debt, Free all collateral, and delete the CDP.<br />
            <strong>Status:</strong> Whether the CDP is safe, unsafe (vulnerable to liquidation), or closed.<br />
            <strong>Tap:</strong> Liquidator.<br />
            <strong>Top:</strong> System overview / settlement.<br />
            <strong>Tub:</strong> CDP engine.<br />
            <strong>Wipe:</strong> Use Sai to cancel CDP debt.<br />
            <strong>Wrap/Unwrap ETH:</strong> Convert Ethereum into an ERC-20 compatible token.<br />
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default TerminologyModal;
