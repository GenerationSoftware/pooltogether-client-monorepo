import classNames from 'classnames'

interface TermsOfServiceProps {
  className?: string
}

export const TermsOfService = (props: TermsOfServiceProps) => {
  const { className } = props

  const h2ClassName = 'text-3xl font-medium'
  const h3ClassName = 'text-xl font-medium'
  const listClassName = 'pl-6 list-disc list-inside'

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <h2 className={h2ClassName}>Terms of Use</h2>
      <span>
        These Terms of Use ("Terms") govern your access to and use of both the cabana.fi website
        (referred to as "cabana.fi") and app.cabana.fi interface (referred to as the “Interface")
        collectively referred to as the "Services." The Services are brought to you by G9 Software
        Inc. (“G9,” "we," "us," or "our").
      </span>
      <span>
        Cabana.fi provides information and resources about the fundamentals of the decentralized
        non-custodial liquidity protocol called the PoolTogether Protocol, comprised of open-source
        self-executing smart contracts that are deployed on various permissionless public
        blockchains, such as Ethereum (the "Protocol"). We do not control or operate any version of
        the Protocol on any blockchain network.
      </span>
      <span>
        The Interface is an independent interface providing multiple applications through which
        users, via their self-custodial wallets, interact with the Protocol, but it is not the sole
        means for interacting with the Protocol.
      </span>
      <span>
        ARBITRATION NOTICE: THESE TERMS CONTAIN AN ARBITRATION CLAUSE BELOW. EXCEPT FOR CERTAIN
        TYPES OF DISPUTES MENTIONED IN THAT ARBITRATION CLAUSE, YOU AND WE AGREE THAT ANY DISPUTES
        RELATING TO THE SERVICES (AS DEFINED BELOW) WILL BE RESOLVED BY MANDATORY BINDING
        ARBITRATION, AND YOU WAIVE ANY RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN A CLASS-ACTION
        LAWSUIT OR CLASS-WIDE ARBITRATION.
      </span>
      <span>You are entering into a binding Agreement.</span>
      <span>
        BY ACCESSING OR USING OUR SERVICES, WHICH INCLUDE OUR VARIOUS WEBSITES, INCLUDING, WITHOUT
        LIMITATION, CABANA.FI AND APP.CABANA.FI (AND ANY RESPECTIVE SUBDOMAINS); APPLICATIONS, AND
        OTHER SERVICES THAT LINK TO THESE TERMS, AS WELL AS ANY INFORMATION, TEXT, LINKS, GRAPHICS,
        PHOTOS, AUDIO, VIDEO, OR OTHER MATERIALS STORED, RETRIEVED OR APPEARING THEREON, WHETHER
        ACCESSED THROUGH THE SITE OR OTHERWISE (COLLECTIVELY, THE “SERVICES”), YOU ARE ENTERING INTO
        A BINDING AGREEMENT WITH US THAT INCLUDES THESE TERMS, PRIVACY POLICY (FOUND HERE), AND
        OTHER POLICIES REFERENCED HEREIN (COLLECTIVELY, THE “AGREEMENT”).
      </span>
      <span>
        To the extent that there is a conflict between these Terms and any applicable additional
        terms, these Terms will control unless expressly stated otherwise. If you don't agree with
        these Terms, you may not use the Services and should not visit the Site or otherwise engage
        with the Services.
      </span>
      <h3 className={h3ClassName}>Our Products</h3>
      <span>
        The Interface provides a web or mobile-based means of access to (a) a decentralized protocol
        on various public blockchains, including but not limited to Ethereum, that allows users to
        participate in permissionless prize savings.
      </span>
      <span>
        The Interface is distinct from the Protocol and is one, but not the exclusive, means of
        accessing the Protocol. The Protocol itself has five versions, designated as v1, v2, v3, v4
        and v5, each of which comprises open-source or source-available self-executing smart
        contracts that are deployed on various public blockchains, such as Ethereum. G9 does not
        control or operate any version of the Protocol on any blockchain network. By using the
        Interface, you understand that you are not buying or selling digital assets from us and that
        we do not operate any liquidity pools on the Protocol. As a general matter, G9 is not a
        liquidity provider into Protocol liquidity pools and liquidity providers are independent
        third parties. The Protocol was initially deployed on the Ethereum blockchain, and has since
        been deployed on several other blockchain networks including by parties other than G9.
        Deployments on other networks typically make use of cross-chain bridges, which allow assets
        native to one blockchain to be transferred to another blockchain. Please note that digital
        assets that have been "bridged" or "wrapped" to operate on other blockchain networks
        (including to blockchains compatible with the Ethereum Virtual Machine that are designed to
        ensure the Ethereum blockchain can effectively process more transactions or other
        blockchains that are frequently referred to as "Layer 2" solutions) are distinct from the
        original Ethereum mainnet asset.
      </span>
      <span>
        To access the Interface, you must use a non-custodial wallet software, which allows you to
        interact with public blockchains. Your relationship with that non-custodial wallet provider
        is governed by the applicable terms of service. We do not have custody or control over the
        contents of your wallet and have no ability to retrieve or transfer its contents. By
        connecting your wallet to our Interface, you agree to be bound by this Agreement and all of
        the terms incorporated herein by reference.
      </span>
      <span>
        In connection with your historic or current use of one or more of our Products, we may
        provide you certain incentives, prizes or rewards for completing certain activities, such as
        completing a certain number of transactions ("User Rewards"). Details regarding the criteria
        for earning a reward will be described within the applicable Product or official
        documentation. Upon satisfaction of the criteria for obtaining a reward and subject to your
        compliance with the associated rewards terms, this Agreement, and applicable law — to be
        determined exclusively by G9 — we will use commercially reasonable efforts to promptly
        transfer the earned reward to the digital wallet that you designate or have connected to the
        applicable Product. We reserve the right to change, modify, discontinue or cancel any
        rewards programs (including the frequency and criteria for earning such User Rewards), at
        any time and without notice to you.
      </span>
      <h3 className={h3ClassName}>Assumption of Risk</h3>
      <span>
        Technologies such as smart contracts on various blockchains, cryptographic tokens generated
        by the smart contracts, and other nascent software, applications, and systems that interact
        with blockchain-based networks are experimental, speculative, inherently risky, and subject
        to change. Among other risks, bugs, malfunctions, cyberattacks, or changes to the applicable
        blockchain (e.g., forks) could disrupt these technologies and even result in a total loss of
        cryptoassets, their market value, or digital funds. We assume no liability or responsibility
        for any such risks. If you are not comfortable assuming these risks, you should not access
        or engage in transactions using blockchain-based technology. We are not responsible for the
        content or services of any third-party, including, without limitation, any network or apps
        like Discord or MetaMask, and we make no representations regarding the content or accuracy
        of any third-party services or materials. The use and access of any third-party products or
        services, including through the Services, are at your own risk. Please note that we do not
        have control over third-party services. Consequently, we cannot guarantee, endorse, or
        recommend such content or services to users of the Interface, nor can we endorse their use
        for any specific purpose. You acknowledge and agree that all transactions accessed through
        the blockchain-based networks will be automatically processed using one or more smart
        contracts. By engaging in transactions using the Services, you acknowledge and consent to
        the automatic processing of all transactions in connection with using the Services. You
        further acknowledge and agree that the applicable smart contract will dictate how the funds
        of a transaction and ownership of cryptoassets are distributed.
      </span>
      <span>
        You bear sole responsibility for evaluating the Services before using them, and all
        transactions on the blockchain are irreversible, final, and without refunds. The Services
        may be disabled, disrupted, or adversely impacted as a result of sophisticated
        cyber-attacks, surges in activity, computer viruses, and/or other operational or technical
        challenges, among other things. We disclaim any ongoing obligation to notify you of all the
        potential risks of using and accessing our Services. You agree to accept these risks and
        agree that you will not seek to hold us responsible for any consequent losses. You
        understand and agree that you are solely responsible for maintaining the security of your
        self-custodial wallet. You alone are responsible for securing your private keys. We do not
        have access to your private keys. Any unauthorized access to your self-custodial wallet by
        third parties could result in the loss or theft of any cryptoasset or funds held in your
        account and any associated accounts. You understand and agree that we have no involvement
        in, and you will not hold us responsible for managing and maintaining the security of your
        self-custodial wallet. The private key associated with the self-custodial wallet address
        from which you transfer cryptoassets or the private key associated is the only private key
        that can control the cryptoassets you transfer into the smart contracts.
      </span>
      <span>
        You agree that we have the right to restrict your access to the Services via any technically
        available methods if we suspect, in our sole discretion, that (a) you are using the Services
        for money laundering or any illegal activity; (b) you have engaged in fraudulent activity;
        (c) you have acquired cryptoassets using inappropriate methods, including the use of stolen
        funds to purchase such assets; (d) you are the target of any sanctions administered or
        enforced by the U.S. Department of the Treasury's Office of Foreign Assets Control (“OFAC”),
        the United Nations Security Council, the European Union, Her Majesty's Treasury, or any
        other legal or regulatory authority in any applicable jurisdiction; (e) either you, as an
        individual or an entity, or your wallet address is listed on the Specially Designated
        Nationals and Blocked Persons List (“SDN List”), Consolidated Sanctions List (“Non-SDN
        Lists), or any other sanctions lists administered by OFAC; (f) you are located, organized,
        or resident in a country or territory that is, or whose government is, the subject of
        sanctions, including but not limited to Côte d'Ivoire, Cuba, Belarus, Iran, Iraq, Liberia,
        North Korea, Sudan, and Syria; or (g) you have otherwise acted in violation of these Terms.
        If we have a reasonable suspicion that you are utilizing the Services for illegal purposes,
        we reserve the right to take whatever action we deem appropriate.
      </span>
      <span>We do not guarantee the quality or accessibility of the Services.</span>
      <span>
        As a condition to accessing or using the Services, you acknowledge, understand, and agree
        that from time to time, the Services may be inaccessible or inoperable for any reason,
        including, but not limited to equipment malfunctions, periodic maintenance procedures or
        repairs, causes beyond our control or that we could not reasonably foresee, disruptions and
        temporary or permanent unavailability of underlying blockchain infrastructure or
        unavailability of third-party service providers or external partners for any reason.
      </span>
      <span>
        You acknowledge and agree that you will access and use the Services at your own risk. You
        should not engage in blockchain-based transactions unless it is suitable given your
        circumstances and financial resources. By using the Services, you represent that you have
        been, are, and will be solely responsible for conducting your own due diligence into the
        risks of a transaction and the underlying smart contracts and cryptoassets.
      </span>
      <span>
        IN SUMMARY, YOU ACKNOWLEDGE THAT WE ARE NOT RESPONSIBLE FOR ANY OF THESE VARIABLES OR RISKS,
        DO NOT OWN OR CONTROL THE PROTOCOL, AND CANNOT BE HELD LIABLE FOR ANY RESULTING LOSSES THAT
        YOU EXPERIENCE WHILE ACCESSING OR USING ANY OF OUR PRODUCTS. ACCORDINGLY, YOU UNDERSTAND AND
        AGREE TO ASSUME FULL RESPONSIBILITY FOR ALL OF THE RISKS OF ACCESSING AND USING THE
        INTERFACE TO INTERACT WITH THE PROTOCOL
      </span>
      <h3 className={h3ClassName}>Prohibited Activity</h3>
      <span>
        You may only use the Services if you comply with this Agreement (including, without
        limitation, these Terms), applicable third-party policies, and all applicable laws, rules,
        regulations, and related guidance. The following conduct is prohibited:
      </span>
      <ul className={listClassName}>
        <li>
          Using the Services for, or to promote or facilitate, illegal activity (including, without
          limitation, money laundering, financing terrorism, tax evasion, buying or selling illegal
          drugs, contraband, counterfeit goods, or illegal weapons)
        </li>
        <li>Exploiting the Services for any unauthorized commercial purpose</li>
        <li>
          Uploading or transmitting viruses, worms, Trojan horses, time bombs, cancel bots, spiders,
          malware, or any other type of malicious code that will or may be used in any way that will
          affect the functionality or operation of the Services
        </li>
        <li>
          Attempting to or actually copying or making unauthorized use of all or any portion of the
          Services, including by attempting to reverse compile, reformatting or framing,
          disassemble, reverse engineer any part of the Services
        </li>
        <li>
          Harvesting or otherwise collecting information from the Services for any unauthorized
          purpose
        </li>
        <li>Using the Services under false or fraudulent pretenses or otherwise being deceitful</li>
        <li>Interfering with other users' access to or use of the Services</li>
        <li>
          Interfering with or circumventing the security features of the Services or any third
          party's systems, networks, or resources used in the provision of Services
        </li>
        <li>
          Engaging in any attack, hack, denial-of-service attack, interference, or exploit of any
          smart contract in connection with the use of the Service (and operations performed by a
          user that are technically permitted by a smart contract may nevertheless be a violation of
          our Agreement, including these Terms, and the law)
        </li>
        <li>Engaging in any anticompetitive behavior or other misconduct</li>
      </ul>
      <span>
        You agree and acknowledge that if you use the Services to engage in conduct prohibited by
        applicable law, we permanently reserve the right to completely or partially restrict or
        revoke your access to the Services, either completely or for a period of time, at our sole
        discretion. We reserve the right to amend, rectify, edit, or otherwise alter transaction
        data to remediate or mitigate any damage caused either to us or to any other person as a
        result of a user's violation of this Agreement or applicable law.
      </span>
      <span>
        We reserve the right to investigate and prosecute any suspected breaches of this Agreement,
        including the Terms. We may disclose any information as necessary to satisfy any law,
        regulation, legal process, or governmental request.
      </span>
      <h3 className={h3ClassName}>Indemnification</h3>
      <span>
        You agree to hold harmless, release, defend, and indemnify us and our officers, directors,
        employees, contractors, agents, affiliates, and subsidiaries from and against all claims,
        damages, obligations, losses, liabilities, costs, and expenses arising from: (a) your access
        and use of any of our Products; (b) your violation of any term or condition of this
        Agreement, the right of any third party, or any other applicable law, rule, or regulation;
        (c) any other party's access and use of any of our Products with your assistance or using
        any device or account that you own or control; and (d) any dispute between you and (i) any
        other user of any of the Products or (ii) any of your own customers or users.
      </span>
      <h3 className={h3ClassName}>Limitation of Liability</h3>
      <span>
        UNDER NO CIRCUMSTANCES SHALL WE OR ANY OF OUR OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS,
        AGENTS, AFFILIATES, OR SUBSIDIARIES BE LIABLE TO YOU FOR ANY INDIRECT, PUNITIVE, INCIDENTAL,
        SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR
        LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE PROPERTY, ARISING OUT OF OR
        RELATING TO ANY ACCESS OR USE OF OR INABILITY TO ACCESS OR USE ANY OF THE PRODUCTS, NOR WILL
        WE BE RESPONSIBLE FOR ANY DAMAGE, LOSS, OR INJURY RESULTING FROM HACKING, TAMPERING, OR
        OTHER UNAUTHORIZED ACCESS OR USE OF ANY OF THE PRODUCTS OR THE INFORMATION CONTAINED WITHIN
        IT, WHETHER SUCH DAMAGES ARE BASED IN CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR
        OTHERWISE, ARISING OUT OF OR IN CONNECTION WITH AUTHORIZED OR UNAUTHORIZED USE OF ANY OF THE
        PRODUCTS, EVEN IF AN AUTHORIZED REPRESENTATIVE OF G9 HAS BEEN ADVISED OF OR KNEW OR SHOULD
        HAVE KNOWN OF THE POSSIBILITY OF SUCH DAMAGES. WE ASSUME NO LIABILITY OR RESPONSIBILITY FOR
        ANY: (A) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT; (B) PERSONAL INJURY OR PROPERTY
        DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM ANY ACCESS OR USE OF THE INTERFACE; (C)
        UNAUTHORIZED ACCESS OR USE OF ANY SECURE SERVER OR DATABASE IN OUR CONTROL, OR THE USE OF
        ANY INFORMATION OR DATA STORED THEREIN; (D) INTERRUPTION OR CESSATION OF FUNCTION RELATED TO
        ANY OF THE PRODUCTS; (E) BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE THAT MAY BE TRANSMITTED
        TO OR THROUGH THE INTERFACE; (F) ERRORS OR OMISSIONS IN, OR LOSS OR DAMAGE INCURRED AS A
        RESULT OF THE USE OF, ANY CONTENT MADE AVAILABLE THROUGH ANY OF THE PRODUCTS; AND (G) THE
        DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF ANY THIRD PARTY.
      </span>
      <span>
        WE HAVE NO LIABILITY TO YOU OR TO ANY THIRD PARTY FOR ANY CLAIMS OR DAMAGES THAT MAY ARISE
        AS A RESULT OF ANY PAYMENTS OR TRANSACTIONS THAT YOU ENGAGE IN VIA ANY OF OUR PRODUCTS, OR
        ANY OTHER PAYMENT OR TRANSACTIONS THAT YOU CONDUCT VIA ANY OF OUR PRODUCTS. EXCEPT AS
        EXPRESSLY PROVIDED FOR HEREIN, WE DO NOT PROVIDE REFUNDS FOR ANY PURCHASES THAT YOU MIGHT
        MAKE ON OR THROUGH ANY OF OUR PRODUCTS.
      </span>
      <span>
        WE MAKE NO WARRANTIES OR REPRESENTATIONS, EXPRESS OR IMPLIED, ABOUT LINKED THIRD PARTY
        SERVICES, THE THIRD PARTIES THEY ARE OWNED AND OPERATED BY, THE INFORMATION CONTAINED ON
        THEM, ASSETS AVAILABLE THROUGH THEM, OR THE SUITABILITY, PRIVACY, OR SECURITY OF THEIR
        PRODUCTS OR SERVICES. YOU ACKNOWLEDGE SOLE RESPONSIBILITY FOR AND ASSUME ALL RISK ARISING
        FROM YOUR USE OF THIRD-PARTY SERVICES, THIRD-PARTY WEBSITES, APPLICATIONS, OR RESOURCES. WE
        SHALL NOT BE LIABLE UNDER ANY CIRCUMSTANCES FOR DAMAGES ARISING OUT OF OR IN ANY WAY RELATED
        TO SOFTWARE, PRODUCTS, SERVICES, AND/OR INFORMATION OFFERED OR PROVIDED BY THIRD-PARTIES AND
        ACCESSED THROUGH ANY OF OUR PRODUCTS.
      </span>
      <span>
        SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF LIABILITY FOR PERSONAL INJURY, OR OF
        INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITATION MAY NOT APPLY TO YOU. IN NO EVENT
        SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES (OTHER THAN AS MAY BE REQUIRED BY
        APPLICABLE LAW IN CASES INVOLVING PERSONAL INJURY) EXCEED THE AMOUNT OF ONE HUNDRED U.S.
        DOLLARS ($100.00 USD) OR ITS EQUIVALENT IN THE LOCAL CURRENCY OF THE APPLICABLE
        JURISDICTION.
      </span>
      <span>THE FOREGOING DISCLAIMER WILL NOT APPLY TO THE EXTENT PROHIBITED BY LAW.</span>
      <h3 className={h3ClassName}>Governing Law, Arbitration, and Waivers</h3>
      <span>
        This Agreement is governed and interpreted in accordance with the province of British
        Columbia and the applicable laws of Canada; and you agree to submit to those laws and the
        courts of British Columbia in the event of any dispute relating to this Agreement.
      </span>
      <span>
        We will use our best efforts to resolve any potential disputes through informal, good faith
        negotiations. If a potential dispute arises, you must contact us by sending an email to
        [legal@g9software.xyz] so that we can attempt to resolve it without resorting to formal
        dispute resolution. If we aren't able to reach an informal resolution within sixty days of
        your email, then you and we both agree to resolve the potential dispute according to the
        process set forth below.
      </span>
      <span>
        Any claim or controversy arising out of or relating to any of our Products, this Agreement,
        or any other acts or omissions for which you may contend that we are liable, including, but
        not limited to, any claim or controversy as to arbitrability ("Dispute"), shall be finally
        and exclusively settled by arbitration under the JAMS Optional Expedited Arbitration
        Procedures. You understand that you are required to resolve all Disputes by binding
        arbitration. The arbitration shall be held on a confidential basis before a single
        arbitrator, who shall be selected pursuant to JAMS rules. The arbitration will be held in
        [LOCATION], unless you and we both agree to hold it elsewhere. Unless we agree otherwise,
        the arbitrator may not consolidate your claims with those of any other party. Any judgment
        on the award rendered by the arbitrator may be entered in any court of competent
        jurisdiction. If for any reason a claim by law or equity must proceed in court rather than
        in arbitration you agree to waive any right to a jury trial and any claim may be brought
        only in the courts of British Columbia.
      </span>
      <span>
        You must bring any and all Disputes against us in your individual capacity and not as a
        plaintiff in or member of any purported class action, collective action, private attorney
        general action, or other representative proceeding. This provision applies to class
        arbitration. You and we both agree to waive the right to demand a trial by jury.
      </span>
      <h3 className={h3ClassName}>Miscellaneous</h3>
      <span>
        These terms constitute the entire agreement between you and us with respect to the subject
        matter hereof. This Agreement supersedes any and all prior or contemporaneous written and
        oral agreements, communications and other understandings (if any) relating to the subject
        matter of the terms.
      </span>
      <span>
        You may not assign or transfer this Agreement, by operation of law or otherwise, without our
        prior written consent. Any attempt by you to assign or transfer this Agreement without our
        prior written consent shall be null and void. We may freely assign or transfer this
        Agreement. Subject to the foregoing, this Agreement will bind and inure to the benefit of
        the parties, their successors and permitted assigns. We may provide any notice to you under
        this Agreement using commercially reasonable means, including using public communication
        channels. Notices we provide by using public communication channels will be effective upon
        posting.
      </span>
      <span>
        If any provision of this Agreement shall be determined to be invalid or unenforceable under
        any rule, law, or regulation of any local, state, or federal government agency, such
        provision will be changed and interpreted to accomplish the objectives of the provision to
        the greatest extent possible under any applicable law and the validity or enforceability of
        any other provision of this Agreement shall not be affected.
      </span>
    </div>
  )
}
