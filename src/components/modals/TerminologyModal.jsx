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
            <strong>Avail. Sai (to draw):</strong>  The maximum Sai that can currently be drawn from a CDP.<br />
            <strong>Avail. SKR (to free):</strong> The maximum SKR that can currently be released from a CDP.<br />
            <strong>Actions:</strong> The actions are: lock / free / draw / wipe / shut / give / bite. All of these, are defined in the beginning of this document.<br />
            <strong>CDP Fee:</strong> CDP interest rate.<br />
            <strong>Collateral Auction:</strong> The auction selling collateral in a liquidated CDP. It is designed to prioritize covering the debt owed by the CDP, then to give the owner the best price possible for their collateral refund.<br />
            <strong>Collateralized Debt Position (CDP):</strong> A smart contract whose users receive an asset (Sai), which effectively operates as a debt instrument with an interest rate. The CDP user has posted collateral in excess of the value of the loan in order to guarantee their debt position.<br />
            <strong>Collateral Ratio:</strong>  The ratio of the value of a CDP’s collateral to the value of its debt.<br />
            <strong>Debt Ceiling:</strong> The maximum number of SAI that can be issued.<br />
            <strong>Debt (Sai):</strong> The amount of outstanding SAI debt in a CDP.<br />
            <strong>Deficit:</strong> Whether the system is at less than 100% overall collateralisation.<br />
            <strong>ETH/SKR:</strong> The price of SKR in Ethereum.<br />
            <strong>Exit:</strong> Exchange SKR for Ethereum.<br />
            <strong>Gap (boom/bust):</strong>  The discount/premium relative to Sai target price at which the system buys/sells collateral SKR for SAI. When negative, collateral is being sold at a discount (under ‘bust’) and bought at a premium (under ‘boom’).<br />
            <strong>Interest rate:</strong> Sai target price drift.<br />
            <strong>Join:</strong> Exchange Ethereum for SKR.<br />
            <strong>Keepers:</strong> Independent economic actors that trade Sai, CDPs and/or MKR, create Sai or close CDPs and seek arbitrage opportunities in The Sai Stablecoin System and as a result help maintain Sai market rationality and price stability.<br />
            <strong>Liq. Penalty:</strong> The penalty charged by the system upon liquidation, as a percentage of the CDP collateral.<br />
            <strong>Liq. Ratio:</strong>  The  collateralization ratio below which a CDP may be liquidated.<br />
            <strong>Liquidation price:</strong> The Ethereum price at which a CDP will become unsafe and at risk of liquidation.<br />
            <strong>Locked (SKR):</strong> The amount of SKR collateral in a CDP.<br />
            <strong>MKR:</strong> The ERC20 token that is used by MKR voters for voting as well as used as a backstop in the case of insolvent Sai CDPs.<br />
            <strong>Oracles:</strong> Ethereum accounts (contracts or users) selected to provide price feeds into various components of The Sai & Sai Stablecoin System.<br />
            <strong>Risk Parameters:</strong> The stability fee, liquidation ratio, boom/bust gap, and debt ceiling.<br />
            <strong>Safe:</strong> Whether the overall collateralization of the system is above the liquidation ratio.<br />
            <strong>Sensitivity Parameter:</strong> The variable that determines how aggressively the Sai Stablecoin System automatically changes the Target Rate in response to Sai market price deviations.<br />
            <strong>SDR:</strong> The Special Drawing Rights, a basket of national currencies maintained by the International Monetary Fund. Widely seen in finance as the most stable reference point for real world values.<br />
            <strong>Status:</strong> Whether the CDP is safe, unsafe (vulnerable to liquidation), or closed.<br />
            <strong>Target Rate Feedback Mechanism:</strong> The way the Sai Stablecoin System adjusts the Target Rate to cause market forces to maintain stability around the Target Rate.<br />
            <strong>USD/ETH:</strong> Price of Ethereum in USD.<br />
            <strong>Wrap/Unwrap ETH:</strong> Convert Ethereum into an ERC-20 compatible token.<br />
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default TerminologyModal;
