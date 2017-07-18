import React, { Component } from 'react';

class AnnouncementText extends Component {
  render() {
    return(
      <div>
        <p>
          We are proud to announce that after more than 2.5 years of development the Maker community is finally able to release its first decentralized stablecoin system.
        </p>
        <p>
          We call this system Sai (contraction of Simple Dai). It is a very basic decentralized stablecoin design that is soft-pegged to 1 USD and backed by ETH as collateral. You can read about it in more detail here:<br /><a href="https://blog.makerdao.com/2017/06/05/introducing-sai/" target="_blank" rel="noopener noreferrer">https://blog.makerdao.com/2017/06/05/introducing-sai/</a>
        </p>
        <p>
          The first Sai instance has been deployed by Mecon BCC pte. ltd., a Singapore based software company founded by Rune Christensen to assist with the operation of early Maker stablecoin prototypes. 
        </p>
        <p>
          Mecon is also providing a distributed set of price feed oracles that Sai require to function.
        </p>
        <p>
          Additionally Mecon retains the ability to perform a global settlement of Sai. A global settlement essentially “unwinds” the system and shuts it down permanently. Every user that holds Sai at the time of the global settlement will receive a claim to exactly 1 USD worth of ETH at the time the global settlement is enacted. CDP users will have their active positions closed automatically and receive their excess collateral as ETH. The global settlement is the primary mechanism enforcing the 1 USD soft-peg of Sai. (Please note that the actual mechanics are slightly more complicated than described here, since users need to convert SKR and W-ETH to regular ETH)
        </p>
        <p>
          Mecon has scheduled this Sai instance to become globally settled at some point in the future to allow for additional upgrades to Sai with a fresh Sai deployment.
        </p>
        <p>
          <strong>It is vital for the safe operation and testing of the first Sai instance that it doesn’t become too popular too quickly.</strong> Mecon will be in charge of publicity around the rollout, and will do so very conservatively. The primary goal will be to give the Maker community a live system that they can observe and interact with, in order to prepare for the future task of governing the more complicated Dai system.
        </p>
        <p>
          If Mecon detects too large an influx of new users external to the Maker community, it will use the global settlement to shut down the system in order to protect users. For this reason we ask everyone in the Maker community to please do not share this announcement or any other news of the Sai deployment unilaterally, but wait for Mecon to publicize the rollout in a controlled fashion.
        </p>
        <p>
          Sai is an experimental decentralized stablecoin prototype in its alpha phase. It is extremely risky and hasn’t yet undergone an external security audit. There are numerous ways the system can fail expectedly or unexpectedly, which in some cases can result in the total loss of all user funds. Therefore it is vital that alpha testers of the system understand to not entrust the system with any more money than they can afford to lose. 
        </p>
        <p>
          The first Sai instance has been deployed with the following <a href="https://github.com/makerdao/docs/blob/master/Dai.md#glossary-of-terms" target="_blank" rel="noopener noreferrer">parameters</a>:
        </p>
        <ul>
          <li>
            Liquidation Ratio: 150%
          </li>
          <li>
            Liquidation Penalty: 20%
          </li>
          <li>
            Debt Ceiling: 100 million Sai
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
          The most important data point to understand is the Liquidation Ratio of 150% and the Liquidation Penalty of 20%. This means that a Sai CDP user must hold his collateral-to-debt ratio above 150% at all times. If the collateral-to-debt ratio of a CDP falls below 150%, it will immediately be forced closed  with an additional 20% penalty added on top of the debt with the remaining 130% collateral returned to the CDP user.
        </p>
        <p>
          This Sai instance is just the first deployment, and there will be many more in the future, all of which will eventually be globally settled in order to pave the way for the deployment of fully realized Dai system. 
          Non exhaustive list of features planned for future Sai deployments:
        </p>
        <ul>
          <li>
            Stability fee with MKR buy and burn
          </li>
          <li>
            Stability fee with SKR buy and burn
          </li>
          <li>
            MKR control of Sai risk parameters through prism voting (Similar to Delegated Proof of Stake used by BitShares, Steemit and EOS)
          </li>
          <li>
            Target Rate Feedback Mechanism replacing the USD target price with a floating price denominated in SDR
          </li>
          <li>
            Several concurrent Sai instances existing alongside each other with different parameters
          </li>
        </ul>
        <p>
          If you have any questions, comments or concerns please join us at <a href="https://chat.makerdao.com/" target="_blank" rel="noopener noreferrer">chat.makerdao.com</a> to assist in the development of Sai.
        </p>
      </div>
    )
  }
}

export default AnnouncementText;
