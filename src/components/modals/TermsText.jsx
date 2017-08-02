import React, { Component } from 'react';

class TermsText extends Component {
  render() {
    return(
      <div>
        <p>
          The user expressly knows and agrees that the user is using the Sai Stablecoin System at the user’s sole risk. The user represents that the user has an adequate understanding of the risks, usage and intricacies of cryptographic tokens, open source software, ethereum platform, Sai, MKR and Ether.
        </p>
        <p>
          Alpha testers who buy Sai or use Sai CDPs, for as long as they hold these Sai or Sai CDPs, are donating their money to a public bug bounty with the understanding that it could be lost at any time, and are doing so for the sake of supporting the further development of Maker, Dai and to experiment with the alpha.
        </p>
        <p>
          Mecon will perform the Sai deployment and its price feed oracle services “as is” without any guarantee that they will perform as described. Mecon does not accept any responsibility should the system fail.
        </p>
        <p>
          Here’s a nonexhaustive list of ways that Sai can fail:
        </p>
        <ul>
          <li>
            An attacker might find a vulnerability in one or more of the Sai smart contracts, and use it to steal all the collateral held in the system. This will result in a total loss of funds for all users of the system, both CDP users and Sai holders.
          </li>
          <li>
            If too many of the price feed oracle servers are compromised by an attacker, it would be possible for the attacker to create faulty market conditions that result in the total loss of funds for all users, both CDP users and Sai holders.
          </li>
          <li>
            A bug in the Sai codebase could result in some or all of the ETH collateral held in the system becoming permanently stuck, resulting in the total loss of funds for all users, both CDP users and Sai holders.
          </li>
          <li>
            A sudden and overwhelming crash in the price of ETH could cause the 1 USD soft-peg to fail, resulting in a partial loss of funds for Sai holders and a total loss of funds for CDP users.
          </li>
        </ul>
        <p>
          The user expressly agrees that no party (including the keyholders or any individual or organization that may have contributed to the development of the sai stablecoin system or ethereum) will be liable under any cause of action or theory of liability, even if such party has been advised of the possibility of such damages, and the user shall hold all other parties harmless, for any (a) indirect, incidental, special, consequential or exemplary damages, (b) loss of profits, revenues, opportunities, or goodwill, (c) unavailability of any or all of the sai stablecoin system, (d) investments, expenditures or commitments by user related to use of or access to the sai stablecoin system, (e) cost of procurement of substitute goods or substitute services (f) acts or omissions attributable to any third-party, (g) lost ether (h) defective code or (i) the execution of the code.
        </p>
        <p>
          User acknowledges and agrees that no party (including the keyholders or any individual or organization that may have contributed to the development of the sai stablecoin system or ethereum) is actually responsible for operation of the sai stablecoin system and that like any other computer program, the sai stablecoin system’ operations are limited to how computation logic interprets the openly disclosed source code and that no party (including the keyholders or any individual or organization that may have contributed to the development of the sai stablecoin system or ethereum) can guarantee that the sai stablecoin system will work as intended (or even work in a manner that is consistent with this document). User is aware that sole reliance on a computer program’s computational logic carries significant risk of unintended risks or results and that in the event of an error, no party (including the keyholders or any individual or organization that may have contributed to the development of the sai stablecoin system or ethereum) is obligated to fix or remediate any problem.
        </p>
        <p>
          User further acknowledges and agrees that there are no other representations or warranties of any kind, whether express, implied, statutory or otherwise, regarding the sai stablecoin system, and user hereby disclaims all other warranties, including any implied or express warranties: (a) of merchantability, satisfactory quality, fitness for a particular purpose, non-infringement, or quiet enjoyment; (b) arising out of any course of dealing or usage of trade; (c) that the sai stablecoin system will be uninterrupted, error free, or free of harmful components; (d) that the sai stablecoin system or any content, including user content or third-party content, will be secure or not otherwise lost or damaged; and (d) the sai stablecoin system will have any functionality that is not a natural result of how the source code should be interpreted.
        </p>
      </div>
    )
  }
}

export default TermsText;
