import React, { Component } from 'react';

class AnnouncementText extends Component {
  render() {
    return(
      <div>
        <p>
          We are proud to announce that after more than 2.5 years of development the Maker community is finally able to release its first decentralized stablecoin system.
        </p>
        <p>
          We call this system Dai (contraction of Simple Dai). It is a very basic decentralized stablecoin design that is soft-pegged to 1 USD and backed by ETH as collateral. You can read about it in more detail here: <a href="https://blog.makerdao.com/2017/06/05/introducing-sai/" target="_blank" rel="noopener noreferrer">https://blog.makerdao.com/2017/06/05/introducing-sai/</a>.
        </p>
        <p>
          The first Dai instance has been deployed by Mecon BCC pte. ltd., a Singapore based software company founded by Rune Christensen to assist with the operation of early Maker stablecoin prototypes.
        </p>
        <p>
          Mecon is also providing a distributed set of price feed oracles that Dai requires to function.
        </p>
        <p>
          Additionally Mecon retains the ability to perform a global settlement of Dai. A global settlement essentially “unwinds” the system and shuts it down permanently. Every user that holds Dai at the time of the global settlement will receive a claim to exactly 1 USD worth of ETH at the time the global settlement is enacted. CDP users will have their active positions closed automatically and receive their excess collateral as ETH. The global settlement is the primary mechanism enforcing the 1 USD soft-peg of Dai. (Please note that the actual mechanics are slightly more complicated than described here, since users need to convert SKR and W-ETH to regular ETH).
        </p>
        <p>
          Mecon has scheduled this Dai instance to become globally settled at some point in the future to allow for additional upgrades to Dai with a fresh Dai deployment.
        </p>
        <p>
          <strong>It is vital for the safe operation and testing of the first Dai instance that it doesn’t become too popular too quickly.</strong> Mecon will be in charge of publicity around the rollout, and will do so very conservatively. The primary goal will be to give the Maker community a live system that they can observe and interact with, in order to prepare for the future task of governing the more complicated Dai system.
        </p>
        <p>
          If Mecon detects too large an influx of new users external to the Maker community, it will use the global settlement to shut down the system in order to protect users. For this reason we ask everyone in the Maker community to please not share this announcement or any other news of the Dai deployment unilaterally, but wait for Mecon to publicize the rollout in a controlled fashion.
        </p>
        <p>
          Dai is an experimental decentralized stablecoin prototype in its alpha phase. It is extremely risky and hasn’t yet undergone an external security audit. There are numerous ways the system can fail expectedly or unexpectedly, which in some cases can result in the total loss of all user funds. Therefore it is vital that alpha testers of the system understand to not entrust the system with any more money than they can afford to lose.
        </p>
        <p>
          The first Dai instance has been deployed with the following parameters:
        </p>
        <ul>
          <li>
            Liquidation Ratio: 150%
          </li>
          <li>
            Liquidation Penalty: 20%
          </li>
          <li>
            Debt Ceiling: 5 million Dai
          </li>
          <li>
            Target Rate: 0% (USD)
          </li>
          <li>
            Stability Fee: 0%
          </li>
          <li>
            Boom/Bust Spread: -5% to 5% (adjustable by Mecon)
          </li>
          <li>
            Join/Exit Spread: 0%
          </li>
        </ul>
        <p>
          The most important data point to understand is the Liquidation Ratio of 150% and the Liquidation Penalty of 20%. This means that a Dai CDP user must hold his collateral-to-debt ratio above 150% at all times. If the collateral-to-debt ratio of a CDP falls below 150%, it becomes vulnerable to liquidation. If liquidation is triggered, the outstanding debt of the CDP increases by 20%, and the CDP is then settled based on the price feed.
        </p>
        <p>
          This Dai instance is just the first of many deployments. There will be continuous iteration on the Dai design and upgrades will be enforced by globally settling prior deployments. If a Dai instance hits its debt ceiling, it may also be necessary to globally settle it. The debt ceiling of the first Dai instance is at 5 million USD, an amount low enough to ensure that it will mainly be considered a livenet experiment for use within the Maker community, not a product release.
        </p>
        <p>
          Non exhaustive list of features planned for future Dai deployments:
        </p>
        <ul>
          <li>
            Stability fee with MKR buy and burn
          </li>
          <li>
            Stability fee with SKR buy and burn
          </li>
          <li>
            MKR control of Dai risk parameters through prism voting (A mechanism similar to Delegated Proof of Stake used by BitShares, Steemit and EOS)
          </li>
          <li>
            Target Rate Feedback Mechanism replacing the USD target price with a floating price denominated in SDR
          </li>
          <li>
            Several concurrent Dai instances existing alongside each other with different parameters
          </li>
        </ul>
        <p>
          If you have any questions, comments or concerns please join us at <a href="https://chat.makerdao.com/" target="_blank" rel="noopener noreferrer">chat.makerdao.com</a> channel #sai-stablecoin-system to assist in the development of Dai.
        </p>
      </div>
    )
  }
}

export default AnnouncementText;
