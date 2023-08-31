import classNames from 'classnames'
import { ReactNode } from 'react'

interface TermsOfServiceProps {
  className?: string
}

export const TermsOfService = (props: TermsOfServiceProps) => {
  const { className } = props

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <H1>Terms of Use</H1>
      <span>
        These Terms of Use ("<strong>Terms</strong>") govern your access to and use of both the
        cabana.fi website (referred to as "<strong>cabana.fi</strong>"), the app.cabana.fi interface
        (referred to as the “<strong>Interface</strong>") and any other product or service that has
        these Terms attached to it, collectively referred to as the "<strong>Services</strong>." The
        Services are brought to you by G9 Software Inc. (“<strong>G9</strong>”, "<strong>we</strong>
        ", "<strong>us</strong>" or "<strong>our</strong>").
      </span>
      <span>
        Cabana.fi provides information and resources about the fundamentals of the decentralized non
        custodial liquidity protocol called the PoolTogether Protocol, comprised of open-source self
        executing smart contracts that are deployed on various permissionless public blockchains,
        such as Ethereum (the "<strong>Protocol</strong>"). We do not control or operate any version
        of the Protocol on any blockchain network.
      </span>
      <span>
        The Interface is an independent interface providing multiple applications through which
        users, via their self-custodial wallets, can interact with the Protocol, but it is not the
        sole means for interacting with the Protocol.
      </span>
      <span>
        <strong>
          ARBITRATION NOTICE: THESE TERMS CONTAIN AN ARBITRATION CLAUSE BELOW. EXCEPT FOR CERTAIN
          TYPES OF DISPUTES MENTIONED IN THAT ARBITRATION CLAUSE, YOU AND WE AGREE THAT ANY DISPUTES
          RELATING TO THE SERVICES (AS DEFINED BELOW) WILL BE RESOLVED BY MANDATORY BINDING
          ARBITRATION, AND YOU WAIVE ANY RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN A
          CLASS-ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.
        </strong>
      </span>
      <span>You are entering into a binding Agreement.</span>
      <span>
        BY ACCESSING OR USING OUR SERVICES, WHICH INCLUDE OUR VARIOUS WEBSITES, INCLUDING, WITHOUT
        LIMITATION, CABANA.FI AND APP.CABANA.FI (AND ANY RESPECTIVE SUBDOMAINS); APPLICATIONS, AND
        OTHER SERVICES THAT LINK TO THESE TERMS, AS WELL AS ANY INFORMATION, TEXT, LINKS, GRAPHICS,
        PHOTOS, AUDIO, VIDEO, OR OTHER MATERIALS STORED, RETRIEVED OR APPEARING THEREON, WHETHER
        ACCESSED THROUGH THE SITE OR OTHERWISE (COLLECTIVELY, THE “SERVICES”), YOU ARE ENTERING INTO
        A BINDING AGREEMENT WITH US THAT INCLUDES THESE TERMS, PRIVACY POLICY (FOUND HERE), AND
        OTHER POLICIES REFERENCED HEREIN (COLLECTIVELY, THE “<strong>AGREEMENT</strong>”).
      </span>
      <span>
        To the extent that there is a conflict between these Terms and any applicable additional
        terms, these Terms will control unless expressly stated otherwise. If you do not agree with
        these Terms, you may not use the Services and should not visit the cabana.fi or otherwise
        engage with the Services.
      </span>
      <H2>1. Our Products, Licenses and User Access</H2>
      <H3>1.1. Product Description.</H3>
      <span>
        The Interface provides a web and mobile-based means of access to a decentralized protocol on
        various public blockchains, including but not limited to Ethereum, that allows users to
        participate in permissionless prize savings.
      </span>
      <span>
        The Interface is distinct from the Protocol and is one, but not the exclusive, means of
        accessing the Protocol. The Protocol itself has five versions, designated as v1, v2, v3, v4
        and v5, each of which comprises open-source or source-available self-executing smart
        contracts that are deployed on various public blockchains, such as Ethereum. G9 does not
        control or operate any version of the Protocol on any blockchain network. By using the
        Interface, you understand that you are not buying or selling digital assets from us and that
        we do not operate any liquidity pools on the Protocol.
      </span>
      <H3>1.2. License.</H3>
      <span>
        If you desire to access or use the Services, G9 grants you a non-exclusive,
        non-sublicensable, non-transferrable, revocable, limited license to access and use the
        Services, as limited by these Terms.
      </span>
      <H3>1.3. No Liquidity Pool.</H3>
      <span>
        As a general matter, G9 is not a liquidity provider into Protocol liquidity pools and
        liquidity providers are independent third parties. The Protocol was initially deployed on
        the Ethereum blockchain and has since been deployed on several other blockchain networks
        including by parties other than G9. Deployments on other networks typically make use of
        cross-chain bridges, which allow assets native to one blockchain to be transferred to
        another blockchain. Please note that digital assets that have been "bridged" or "wrapped" to
        operate on other blockchain networks (including to blockchains compatible with the Ethereum
        Virtual Machine that are designed to ensure the Ethereum blockchain can effectively process
        more transactions or other blockchains that are frequently referred to as "Layer 2"
        solutions) are distinct from the original Ethereum mainnet asset.
      </span>
      <H3>1.4. Access to the Service.</H3>
      <span>
        To access the Interface, you must use a non-custodial wallet software, which allows you to
        interact with public blockchains. Your relationship with that non-custodial wallet provider
        is governed by the applicable terms of service. We do not have custody or control over the
        contents of your wallet and have no ability to retrieve or transfer its contents. By
        connecting your wallet to our Interface, you agree to be bound by this Agreement and all of
        the terms incorporated herein by reference.
      </span>
      <H3>1.5. Wallet Address.</H3>
      <span>
        If required by G9, you must provide an appropriate secure key, digital wallet address
        compatible with the Protocol such as MetaMask, or other digital wallet information
        acceptable to G9 (each, an “<strong>Address</strong>”) to facilitate your use of the
        Services. If an Address provided by you does not work, is not compatible or needs updating,
        it shall be your sole responsibility to inform G9 of any issues and provide any updated
        Address information.
      </span>
      <H3>1.6. User Rewards.</H3>
      <span>
        In connection with your historic or current use of one or more of our Products, we may
        provide you certain incentives, prizes or rewards for completing certain activities, such as
        completing a certain number of transactions ("<strong>User Rewards</strong>"). Details
        regarding the criteria for earning a reward will be described within the applicable Product
        or official documentation. Upon satisfaction of the criteria for obtaining a reward and
        subject to your compliance with the associated rewards terms, this Agreement, and applicable
        law — to be determined exclusively by G9 — we will use commercially reasonable efforts to
        promptly transfer the earned reward to the digital wallet that you designate or have
        connected to the applicable Product. We reserve the right to change, modify, discontinue or
        cancel any rewards programs (including the frequency and criteria for earning such User
        Rewards), at any time and without notice to you.
      </span>
      <H2>2. Verification, Restrictions and Termination.</H2>
      <H3>2.1. User Verification.</H3>
      <span>
        Because cryptocurrencies and blockchain technologies are subject to significant levels of
        abuse by hackers and criminals, and are often heavily regulated in certain jurisdictions, G9
        reserves the right to collect a variety of personal verification information (“
        <strong>Verification Information</strong>”) as part of the requirements for using or
        accessing the Services to fulfill any legal obligations that might apply in your
        jurisdiction. Verification Information may include, but is not limited to, your: name, email
        address, contact information, telephone number, username, government issued id, date of
        birth and other information collected at the time you access the Services. You acknowledge
        and agree that your personal data may be disclosed to authorities in your jurisdiction in
        order for G9 to comply with its legal obligations.
      </span>
      <H3>2.2. Accuracy of Verification Information.</H3>
      <span>
        In providing Verification Information, you confirm that it is accurate and authentic. After
        providing any Verification Information, you shall maintain the complete accuracy of
        Verification Information, including contact details, and update such information in a timely
        manner when necessary. If there is any reasonable doubt that any information provided by you
        is inaccurate, outdated or incomplete, you shall correct or remove relevant information or
        G9 may terminate all or part of your access to the Services. G9 may contact you at any time
        to correct your Verification Information. You are responsible for any loss or expenses
        incurred if you cannot be reached through the contact information provided to G9.
      </span>
      <H3>2.3. Restrictions and Termination.</H3>
      <span>
        You agree that we have the right to restrict your access to the Services via any technically
        available methods if we suspect, in our sole discretion, that:
      </span>
      <List>
        <li>(a) you are using the Services for money laundering or any illegal activity;</li>
        <li>(b) you have engaged in fraudulent activity;</li>
        <li>
          (c) you have acquired cryptoassets using inappropriate methods, including the use of
          stolen funds to purchase such assets;
        </li>
        <li>
          (d) you are the target of any sanctions administered or enforced by the U.S. Department of
          the Treasury's Office of Foreign Assets Control (“OFAC”), the United Nations Security
          Council, the European Union, Her Majesty's Treasury, or any other legal or regulatory
          authority in any applicable jurisdiction;
        </li>
        <li>
          (e) either you, as an individual or an entity, or your wallet address is listed on the
          Specially Designated Nationals and Blocked Persons List (“SDN List”), Consolidated
          Sanctions List (“Non-SDN Lists), or any other sanctions lists administered by OFAC;
        </li>
        <li>
          (f) you are located, organized, or resident in a country or territory that is, or whose
          government is, the subject of sanctions, including but not limited to Côte d'Ivoire, Cuba,
          Belarus, Iran, Iraq, Liberia, North Korea, Sudan, and Syria; or
        </li>
        <li>(g) you have otherwise acted in violation of these Terms.</li>
      </List>
      <span>
        If we have a reasonable suspicion that you are utilizing the Services for illegal purposes,
        we reserve the right to take whatever action we deem appropriate.
      </span>
      <H3>2.4. Prohibited Activity</H3>
      <span>
        You may only use the Services if you comply with this Agreement (including, without
        limitation, these Terms), applicable third-party policies, and all applicable laws, rules,
        regulations, and related guidance. The following conduct is prohibited:
      </span>
      <List>
        <li>
          (a) using the Services for, or to promote or facilitate, illegal activity (including,
          without limitation, money laundering, financing terrorism, tax evasion, buying or selling
          illegal drugs, contraband, counterfeit goods, or illegal weapons);
        </li>
        <li>(b) exploiting the Services for any unauthorized commercial purpose;</li>
        <li>
          (c) uploading or transmitting viruses, worms, Trojan horses, time bombs, cancel bots,
          spiders, malware, or any other type of malicious code that will or may be used in any way
          that will affect the functionality or operation of the Services;
        </li>
        <li>
          (d) attempting to or actually copying or making unauthorized use of all or any portion of
          the Services, including by attempting to reverse compile, reformatting or framing,
          disassemble, reverse engineer any part of the Services;
        </li>
        <li>
          (e) harvesting or otherwise collecting information from the Services for any unauthorized
          purpose;
        </li>
        <li>
          (f) using the Services under false or fraudulent pretenses or otherwise being deceitful;
        </li>
        <li>(g) interfering with other users' access to or use of the Services;</li>
        <li>
          (h) interfering with or circumventing the security features of the Services or any third
          party's systems, networks, or resources used in the provision of Services;
        </li>
        <li>
          (i) engaging in any attack, hack, denial-of-service attack, interference, or exploit of
          any smart contract in connection with the use of the Service (and operations performed by
          a user that are technically permitted by a smart contract may nevertheless be a violation
          of our Agreement, including these Terms, and the law); and
        </li>
        <li>(j) engaging in any anticompetitive behavior or other misconduct.</li>
      </List>
      <span>
        You agree and acknowledge that if you use the Services to engage in conduct prohibited by
        applicable law, we permanently reserve the right to completely or partially restrict or
        revoke your access to the Services, either completely or for a period of time, at our sole
        discretion. We reserve the right to amend, rectify, edit, or otherwise alter transaction
        data to remediate or mitigate any damage caused either to us or to any other person as a
        result of a user's violation of this Agreement or applicable law.
      </span>
      <H2>3. Assumption of Risk and Liability</H2>
      <H3>3.1. Assumption of Risk.</H3>
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
        of any third party services or materials. The use and access of any third-party products or
        services, including through the Services, are at your own risk. Please note that we do not
        have control over third-party services. Consequently, we cannot guarantee, endorse, or
        recommend such content or services to users of the Interface, nor can we endorse their use
        for any specific purpose. You acknowledge and agree that all transactions accessed through
        the blockchain based networks will be automatically processed using one or more smart
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
        self-custodial wallet. The private key associated with the self custodial wallet address
        from which you transfer cryptoassets or the private key associated is the only private key
        that can control the cryptoassets you transfer into the smart contracts.
      </span>
      <H3>3.2. No Guarantee.</H3>
      <span>We do not guarantee the quality or accessibility of the Services.</span>
      <span>
        As a condition to accessing or using the Services, you acknowledge, understand, and agree
        that from time to time, the Services may be inaccessible or inoperable for any reason,
        including, but not limited to equipment malfunctions, periodic maintenance procedures or
        repairs, causes beyond our control or that we could not reasonably foresee, disruptions and
        temporary or permanent unavailability of underlying blockchain infrastructure or
        unavailability of third-party service providers or external partners for any reason.
      </span>
      <H3>3.3. Use at Own Risk.</H3>
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
        INTERFACE TO INTERACT WITH THE PROTOCOL.
      </span>
      <span>
        We reserve the right to investigate and prosecute any suspected breaches of this Agreement,
        including the Terms. We may disclose any information as necessary to satisfy any law,
        regulation, legal process, or governmental request.
      </span>
      <H3>3.4. Indemnification</H3>
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
      <H3>3.5. Limitation of Liability</H3>
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
        SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF LIABILITY FOR PERSONAL INJURY, OR OF
        INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITATION MAY NOT APPLY TO YOU. IN NO EVENT
        SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES (OTHER THAN AS MAY BE REQUIRED BY
        APPLICABLE LAW IN CASES INVOLVING PERSONAL INJURY) EXCEED THE AMOUNT OF ONE HUNDRED U.S.
        DOLLARS ($100.00 USD) OR ITS EQUIVALENT IN THE LOCAL CURRENCY OF THE APPLICABLE
        JURISDICTION.
      </span>
      <H3>3.6. DISCLAIMER.</H3>
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
      <span>THE FOREGOING DISCLAIMER WILL NOT APPLY TO THE EXTENT PROHIBITED BY LAW.</span>
      <H2>4. Governing Law, Arbitration, and Waivers</H2>
      <H3>4.1. Governing Law.</H3>
      <span>
        This Agreement is governed and interpreted in accordance with the province of British
        Columbia and the applicable laws of Canada; and you agree to submit to those laws and the
        courts of British Columbia in the event of any dispute relating to this Agreement.
      </span>
      <H3>4.2. Negotiations and Arbitration.</H3>
      <span>
        We will use our best efforts to resolve any potential disputes through informal, good faith
        negotiations. If a potential dispute arises, you must contact us by sending an email to
        contact@g9software.xyz so that we can attempt to resolve it without resorting to formal
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
        Vancouver, British Columbia, Canada, unless you and we both agree to hold it elsewhere.
        Unless we agree otherwise, the arbitrator may not consolidate your claims with those of any
        other party. Any judgment on the award rendered by the arbitrator may be entered in any
        court of competent jurisdiction. If for any reason a claim by law or equity must proceed in
        court rather than in arbitration you agree to waive any right to a jury trial and any claim
        may be brought only in the courts of British Columbia.
      </span>
      <span>
        You must bring any and all Disputes against us in your individual capacity and not as a
        plaintiff in or member of any purported class action, collective action, private attorney
        general action, or other representative proceeding. This provision applies to class
        arbitration. You and we both agree to waive the right to demand a trial by jury.
      </span>
      <H2>5. Miscellaneous</H2>
      <H3>5.1. Entire Agreement.</H3>
      <span>
        These terms constitute the entire agreement between you and us with respect to the subject
        matter hereof. This Agreement supersedes any and all prior or contemporaneous written and
        oral agreements, communications and other understandings (if any) relating to the subject
        matter of the terms.
      </span>
      <H3>5.2. Assignment.</H3>
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
      <H3>5.3. Taxes.</H3>
      <span>
        It is your responsibility to abide by local laws in relation to the legal usage of the
        Services in your jurisdiction, including the applicability of tax laws to the sale or
        transfer of assets, as well as withholding, collection, reporting and remittance to
        appropriate tax authorities.
      </span>
      <H3>5.4. Illicit Proceeds.</H3>
      <span>
        You acknowledge and declare that the source of any funds, including cryptocurrencies used
        through the Services, come from a legitimate source and are not derived from illegal
        activities. G9 cooperates with law enforcement authorities globally and will not hesitate to
        terminate your access to the Service when flagged by investigators or government authorities
        under a proper legal mandate, including any applicable anti-money laundering and
        anti-terrorism laws.
      </span>
      <H3>5.5. Severability.</H3>
      <span>
        If any provision of this Agreement shall be determined to be invalid or unenforceable under
        any rule, law, or regulation of any local, state, or federal government agency, such
        provision will be changed and interpreted to accomplish the objectives of the provision to
        the greatest extent possible under any applicable law and the validity or enforceability of
        any other provision of this Agreement shall not be affected.
      </span>
      <H3>5.6. Contact.</H3>
      <span>You may contact G9 regarding these Terms by emailing contact@g9software.xyz.</span>
      <H3>5.7. Updates.</H3>
      <span>
        G9 agrees to notify you of an update to the TOS by a posting on cabana.fi and the Interface.
        You are deemed to accept an update by continuing to use the Services. Unless G9 states
        otherwise, updates are automatically effective 30 days after posting.
      </span>
    </div>
  )
}

const H1 = (props: { children: ReactNode }) => {
  return <h1 className='text-3xl font-medium'>{props.children}</h1>
}

const H2 = (props: { children: ReactNode }) => {
  return <h1 className='text-xl font-medium'>{props.children}</h1>
}

const H3 = (props: { children: ReactNode }) => {
  return <h1 className='font-medium'>{props.children}</h1>
}

const List = (props: { children: ReactNode }) => {
  return <ul className='pl-6'>{props.children}</ul>
}
