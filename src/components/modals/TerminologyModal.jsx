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
            <strong>% Tot (SKR):</strong> Ratio of collateral SKR to total outstanding SKR<br />
            <strong>% Ratio:</strong> Collateral ratio of the CDP<br />
            <strong>Account:</strong> User’s active ethereum account<br />
            <strong>Avail. Sai (to draw):</strong> Maximum Sai that can currently be drawn from a CDP<br />
            <strong>Avail. SKR (to free):</strong> Maximum SKR that can currently be released from a CDP<br />
            <strong>Bite:</strong> Initiate liquidation of an undercollateralized CDP<br />
            <strong>Boom:</strong> Buy SAI with SKR<br />
            <strong>Bust:</strong> Buy SKR with SAI<br />
            <strong>CDP Fee:</strong> CDP interest rate<br />
            <strong>Collateral Auction:</strong> The auction selling collateral in a liquidated CDP. It is designed to prioritize covering the debt owed by the CDP, then to give the owner the best price possible for their collateral refund<br />
            <strong>Collateralized Debt Position (CDP):</strong> A smart contract whose users receive an asset (Sai), which effectively operates as a debt instrument with an interest rate. The CDP user has posted collateral in excess of the value of the loan in order to guarantee their debt position<br />
            <strong>Collateral Ratio:</strong> Ratio of the value of a CDP’s collateral to the value of its debt<br />
            <strong>Debt Ceiling:</strong> Maximum number of SAI that can be issued<br />
            <strong>Debt (Sai):</strong> Amount of outstanding SAI debt in a CDP<br />
            <strong>Deficit:</strong> Whether the system is at less than 100% overall collateralisation<br />
            <strong>Draw:</strong> Create Sai against a CDP<br />
            <strong>ETH:</strong> Ethereum<br />
            <strong>ETH/USD:</strong> Price of 1 ETH in USD (as determined by the median of the feeds)<br />
            <strong>Exit:</strong> Exchange SKR for ETH<br />
            <strong>Free:</strong> Remove collateral from a CDP<br />
            <strong>Give:</strong> Transfer CDP ownership<br />
            <strong>Join:</strong> Exchange ETH for SKR<br />
            <strong>Keepers:</strong> Independent economic actors that trade Sai, CDPs and/or MKR, create Sai or close CDPs and seek arbitrage opportunities in The Sai Stablecoin System and as a result help maintain Sai market rationality and price stability<br />
            <strong>Liq. Penalty:</strong> Penalty charged by the system upon liquidation, as a percentage of the CDP collateral<br />
            <strong>Liq. Ratio:</strong> Collateralization ratio below which a CDP may be liquidated<br />
            <strong>Liquidation price:</strong> ETH price at which a CDP will become unsafe and at risk of liquidation<br />
            <strong>Lock:</strong> Add collateral to a CDP<br />
            <strong>Locked (SKR):</strong> Amount of SKR collateral in a CDP<br />
            <strong>Oracles:</strong> Ethereum accounts (contracts or users) selected to provide price feeds into various components of The Sai &amp; Sai Stablecoin System<br />
            <strong>Open:</strong> Open a new CDP<br />
            <strong>Risk Parameters:</strong> The stability fee, liquidation ratio, boom/bust gap, and debt ceiling<br />
            <strong>Safe:</strong> Whether the overall collateralization of the system is above the liquidation ratio<br />
            <strong>SAI Target Rate:</strong> Annual % change of Sai target price in USD. This represents Sai deflation or inflation when positive or negative, respectively<br />
            <strong>SAI/USD:</strong> Target price for 1 SAI in USD<br />
            <strong>SKR:</strong> The token used as collateral in CDPs which represents a claim on the ETH collateral pool of the Sai Stablecoin System<br />
            <strong>SKR/ETH:</strong> Amount of collateral pool ETH claimed by 1 SKR<br />
            <strong>Shut:</strong> Close a CDP - Wipe all debt, Free all collateral, and delete the CDP<br />
            <strong>Spread (boom/bust):</strong> Discount/premium relative to Sai target price at which the system buys/sells collateral SKR for SAI. When negative, collateral is being sold at a discount (under ‘bust’) and bought at a premium (under ‘boom’)<br />
            <strong>Spread (join/exit):</strong> Discount/premium for converting between ETH and SKR via join and exit; the profits are accrued to the SKR collateral pool<br />
            <strong>Status:</strong> Whether the CDP is safe, unsafe (vulnerable to liquidation), or closed<br />
            <strong>Tap:</strong> Liquidator<br />
            <strong>Top:</strong> System overview / settlement<br />
            <strong>Tub:</strong> CDP engine<br />
            <strong>Wipe:</strong> Use Sai to cancel CDP debt<br />
            <strong>Wrap/Unwrap ETH:</strong> Convert Ethereum into an ERC-20 compatible token<br />
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default TerminologyModal;
