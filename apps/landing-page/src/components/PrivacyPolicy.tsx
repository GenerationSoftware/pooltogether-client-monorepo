import classNames from 'classnames'
import Link from 'next/link'
import { ReactNode } from 'react'

interface PrivacyPolicyProps {
  className?: string
}

export const PrivacyPolicy = (props: PrivacyPolicyProps) => {
  const { className } = props

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <H1>Privacy Policy</H1>
      <span>
        This Privacy Policy applies to cabana.fi (the “<strong>Website</strong>”) operated by G9
        Software Inc. (“<strong>G9 Software</strong>”, “<strong>we</strong>”, “<strong>our</strong>”
        or “<strong>us</strong>”) and applies to all G9 Software services, including but not limited
        to G9 Software applications, the Website and any other product or service that we choose to
        apply this Privacy Policy to (collectively, the “<strong>Service</strong>”), and details how
        we collect, use, and disclose data about our users, including you.
      </span>
      <span>
        <strong>
          BY CLICKING “I AGREE” OR SIMILAR CONFIRMATION OR BY USING THE SERVICE YOU ARE AGREEING TO
          THE TERMS OF THIS PRIVACY POLICY AS APPLICABLE IN YOUR JURISDICTION.
        </strong>
      </span>
      <H2>1. HOW WE OBTAIN YOUR DATA</H2>
      <span>
        The Service collects and processes personal data, which is information about you or that
        identifies you.
      </span>
      <span>
        We obtain your personal data directly from you or when you use the Service. Your provision
        of personal data to G9 Software is governed by our Terms of Use (“<strong>TOU</strong>”),
        which you must agree to in order to use the Service, and this Privacy Policy. If you have
        any questions or concerns about the disclosure of your personal data please contact us at
        your convenience using the contact information found below.
      </span>
      <span>
        Subject to legal, contractual and technical requirements, you may choose not to provide G9
        Software with certain data or request the deletion of certain data, which may impact the
        Service features available to you or essential operations of the Service.
      </span>
      <H2>2. PERSONAL DATA WE COLLECT</H2>
      <span>
        We collect personal data about you when you access the Service and while you use the
        Service. The following is a description of the personal data that we may collect, use and
        process in connection with the Service:
      </span>
      <List>
        <li>
          • browsing data such as page views, length of time on certain pages, referral links
          embedded in URLs, device types, browser type and country of origin (based on IP address
          collection).
        </li>
        <li>• the wallet address you use to connect to the interface.</li>
      </List>
      <H2>3. PROCESSING OF YOUR PERSONAL DATA</H2>
      <span>
        We process your personal data primarily for our legitimate business purposes, such as
        providing the Service to you, to understand your needs and the needs of our users and to
        improve the quality of the Service and analyze the data we collect. Specifically, these uses
        include but are not limited to:
      </span>
      <List>
        <li>• displaying and delivering the Service to you;</li>
        <li>• interacting with other users through features of the Service;</li>
        <li>
          • authenticating users, maintaining and analyzing functionality of the Service, backing up
          data or testing and researching new features of the Service;
        </li>
        <li>
          • supporting the security and integrity of the Service and its users including but not
          limited to detecting and protecting G9 Software and other third-parties against error,
          fraud, theft and other illegal activity or for contractual, legal, regulatory or audit
          obligations;
        </li>
        <li>• investigating improper or suspicious activity; and</li>
        <li>
          • contacting you for various reasons including, but not limited to, user feedback requests
          or marketing purposes, if you previously consented to such contact.
        </li>
      </List>
      <span>
        We may disclose your personal data to our parent companies, affiliates, subsidiaries,
        employees and contractors for the same purposes described above. We may also disclose your
        personal data to third-parties, who may be located in a foreign jurisdiction and subject to
        foreign laws. The situations where we disclose your personal data to third-parties include,
        but are not limited to:
      </span>
      <List>
        <li>
          • processing your information as described above as well as providing and enhancing the
          Service features;
        </li>
        <li>
          • providing customer support and feedback, analyzing the Service functionality and
          technical issues, tracking use of the Service and generating reports and data models that
          we use to improve the service;
        </li>
        <li>
          • providing customized, tailored and personalized advertisements to users of the Service;
          and
        </li>
        <li>
          • responding to a request from law enforcement or a government that has asserted its
          lawful authority to obtain the data or where G9 Software has reasonable grounds to believe
          the data could be useful in the investigation of unlawful activity, complying with a
          subpoena or warrant or an order made by a court, person or body with jurisdiction to
          compel the production of data, complying with court rules regarding the production of
          records and data, defending our rights and the rights of others or providing information
          to our legal counsel.
        </li>
      </List>
      <H2>4. THIRD-PARTY SERVICES</H2>
      <span>
        The Privacy Policy only applies to personal data that G9 Software collects, processes and
        discloses and does not apply to the collection, processing and disclosure of data by third
        parties, through third-party services, which may be broader than set forth in this Privacy
        Policy, and that may be embedded into the Service. In many cases, third-parties may collect
        personal information about a user's online activities over time and across different
        websites and services. We strongly recommend that you read each third-party privacy policy
        carefully before using the Service. G9 Software may provide data to third-parties, including{' '}
        <Link href='https://usefathom.com/data' target='_blank' className='text-pt-teal'>
          Fathom Analytics
        </Link>
        . Please contact us directly using the information found below if you would like to learn
        more about third-party data practices.
      </span>
      <H2>5. COOKIES AND DIGITAL TRACKING TECHNOLOGIES</H2>
      <span>
        The Service uses tracking technologies from Fathom Analytics, to collect data about you,
        such as your IP address. Based on this data, third-parties may be able to resolve your
        identity across multiple devices, for example, by matching your IP address, in order to
        target you based on your online behavior. This data is collected, used and disclosed in
        accordance with the terms of this Privacy Policy and the applicable third-party privacy
        policies. Certain features of the Service may rely on tracking technologies and by declining
        to accept cookies, disabling JavaScript or by changing certain settings on your device, you
        may not have access to these features. You have the right to opt-out of certain cookies that
        are not necessary for the operations of the Service, including third-party cookies and may
        do so here.
      </span>
      <H2>6. OBTAINING, RECTIFYING AND CONTROLLING YOUR PERSONAL DATA</H2>
      <span>
        You may contact G9 Software to obtain a copy of any personal data we have collected about
        you, the production of which may be subject to a fee as permitted by applicable law. In
        addition, you may contact G9 Software to correct inaccurate personal data or to complete
        incomplete personal data.
      </span>
      <span>
        You may be able to opt-out of some or all of the ways in which your personal data is
        processed, or request the deletion of certain personal data, except where the personal data
        is necessary or vital:
      </span>
      <List>
        <li>• for the performance of contractual obligations, such as the TOU;</li>
        <li>• to comply with our legal obligations;</li>
        <li>• to protect your interests or those of another person; and</li>
        <li>• for our legitimate interests or the legitimate interests of a third-party,</li>
      </List>
      <span>
        and may do so by removing personal data, if the Service permits such removal, or by
        contacting us using the contact information found below.
      </span>
      <H2>7. DATA STORAGE, RETENTION AND TRANSFERS</H2>
      <span>
        While G9 Software is a Canadian company, the data you provide through the Service may be
        stored and processed by third parties in countries around the world. You authorize G9
        Software and third parties acting on our behalf to process your data in any country of their
        choosing, which may cause your data, including personal and anonymous data, to be subject to
        privacy protections and legal rights that may not be equivalent to those in your country.
      </span>
      <span>
        G9 Software complies with international personal data transfer laws in applicable
        jurisdictions. For EU residents, G9 Software complies with Articles 44-49 of the European
        Union's General Data Protection Regulation (the “<strong>GDPR</strong>”). Currently, all
        transfers of personal data to Canada from residents of the EU are covered by an adequacy
        decision as described in Article 45 of the GDPR.
      </span>
      <span>
        Your personal data is retained until you request its deletion or until G9 Software no longer
        requires such data for the purpose for which it was collected or until required to be
        deleted by laws applicable in your jurisdiction. Please email us at contact@g9software.xyz
        to delete any personal data we hold.
      </span>
      <H2>8. CHILDREN</H2>
      <span>
        G9 Software complies with the U.S. Children's Online Privacy Protection Act and all other
        applicable laws and regulations concerning children and the Internet. The Service is not
        directed to children under the age of 13 and we do not knowingly collect personal
        information from children under the age of 13. If we learn that we inadvertently collected
        personal information from a child under the age of 13, we will delete that information as
        quickly as possible. If you are a parent or guardian of a child who you believe provided G9
        Software with personal information without your consent, please contact us at
        contact@g9software.xyz.
      </span>
      <H2>9. DO NOT TRACK DISCLOSURE</H2>
      <span>
        Do Not Track (“<strong>DNT</strong>”) is a web or device setting that allows users to
        request that receivers of personal data stop their tracking activities. When you choose to
        turn on the DNT setting in your browser or device or use alternative consumer choice
        mechanisms, your browser or device sends a special signal to websites, analytics companies,
        advertising networks, plug in providers and other web services you encounter to stop
        tracking your activity. Currently, there are no DNT technology standards and it is possible
        that there may never be any DNT technology standards. As a result, we do not respond to DNT
        requests.
      </span>
      <H2>10. CALIFORNIA “SHINE THE LIGHT” RIGHT</H2>
      <span>
        If you are a California resident, California Civil Code 1798.83 grants you the right to
        request our disclosure of the categories of personal information we provided to third
        parties, and the names and addresses of these third parties, for direct marketing purposes
        during the preceding calendar year. If you are a California resident and would like to make
        this request, please contact us using the contact information set forth below.
      </span>
      <span>Please note that you may only make this request once per year.</span>
      <H2>11. YOUR CALIFORNIA PRIVACY RIGHTS</H2>
      <span>
        If you are a California resident, California Civil Code Section 1798.120 permits you to
        opt-out of the sale of your personal information to third parties. Currently, G9 Software
        does not sell your personal information to third parties and as such no opt-out of the sale
        of such personal information is necessary. Although G9 Software does not sell your personal
        information, G9 Software does provide a general opt-out right to all of our users as
        described in our Privacy Policy. Furthermore, as G9 Software already complies with Canadian
        and EU privacy laws, the rights required to be provided by law to Californian residents are
        provide to all our users. If you have any other questions about our privacy practices,
        please email us at contact@g9software.xyz.
      </span>
      <H2>12. EUROPEAN USERS AND RIGHTS OF EUROPEAN UNION RESIDENTS</H2>
      <span>
        G9 Software has a legitimate interest, as described in Article 6(1)(f) of the GDPR, in
        collecting your personal data as described in section 2 of this Privacy Policy for the
        purposes described in detail in section 3 of this Privacy Policy. In addition, when you
        provide consent to contact you using your email address or when providing us your contact
        information in some other manner, G9 Software may contact and communicate with you using
        this information, pursuant to Article 6(1)(a) of the GDPR.
      </span>
      <span>
        If you are a resident of the European Union, you have certain rights in regards to your
        personal data. These rights include:
      </span>
      <List>
        <li>
          • <strong>A Right of Access.</strong> You have the right to access your personal data that
          we hold about you free of charge in most circumstances;
        </li>
        <li>
          • <strong>A Right to Rectification.</strong> If your personal data is inaccurate or
          incomplete, you can change the information you provided by changing the information
          yourself on your Account or by contacting G9 Software using the email listed below;
        </li>
        <li>
          • <strong>A Right to Erasure.</strong> You have the right to obtain deletion of personal
          data concerning you in many cases. Often you can just delete your information by yourself
          through your Account but you can also request the deletion by using the contact
          information found below. Please be careful as the deletion of your data in this manner is
          permanent and may never be restored;
        </li>
        <li>
          • <strong>A Right to Object.</strong> If the processing of your personal data is based on
          legitimate interests according to Article 6(1)(f) of the GDPR, you have the right to
          object to this processing in most cases. If you object, we will no longer process your
          personal data unless there are compelling and prevailing legitimate grounds for the
          processing as described in Article 21 of the GDPR; in particular if the personal data is
          necessary for the establishment, exercise or defense of legal claims or in the case where
          the personal data is required for the provision of certain features of the Service and you
          still wish to use such features of the Service;
        </li>
        <li>
          • <strong>A Right to file a Complaint.</strong> You have the right to file a complaint
          with the appropriate supervisory authority in your jurisdiction;
        </li>
        <li>
          • <strong>A Right to Restriction of Processing of your Personal Data.</strong> You have
          the right to obtain restrictions on the processing of your personal data as described in
          Article 18 of the GDPR;
        </li>
        <li>
          • <strong>A Right to Personal Data Portability.</strong> You have the right to receive
          your Personal Data in a structured, commonly used and machine-readable format and have the
          right to transmit such data to another controller under the conditions described in
          Article 20 of the GDPR. G9 Software will comply will all requests for the portability of
          your personal data;
        </li>
        <li>
          • <strong>A Right to Post-Mortem Control of Your Personal Data.</strong> If certain data
          protection legislation and related regulations apply to you, you have the right to
          establish guidelines for the preservation, the deletion and the transmission of your
          personal data after your death; and
        </li>
        <li>
          • <strong>A Right to Opt-out of Marketing Communications.</strong> You have the right to
          opt-out of marketing communications we send you at any time. You can exercise this right
          by clicking on the “unsubscribe” or “opt-out” link on any marketing e-mails G9 Software
          sends you. To opt-out of other forms of marketing, please contact us using the contact
          details provided below.
        </li>
      </List>
      <H2>13. CHANGE OF OWNERSHIP OR BUSINESS TRANSITION</H2>
      <span>
        In the event of, or in preparation for, a change of ownership or control of G9 Software or a
        business transition such as the sale of G9 Software or the sale of some or all G9 Software's
        assets, we may disclose and/or transfer your personal and anonymous data to third-parties
        who will have the right to continue to collect and use such data in the manner set forth in
        this Privacy Policy.
      </span>
      <H2>14. SECURITY</H2>
      <span>
        We are committed to ensuring that your data is secure. To prevent unauthorized access,
        disclosure, or breach, we have put in place suitable physical, electronic, and
        administrative procedures to safeguard and secure the data we collect and process.
      </span>
      <H2>15. CONTACT PREFERENCES</H2>
      <span>
        We communicate with our users primarily through the Service itself, but we may sometimes
        collect the email address of some of our users in order to respond to support requests or
        comments. If you have provided us with your email address and would like to change the email
        preferences we associate with you (for example, unsubscribing from receiving certain types
        of email) you may do so by clicking a link within certain types of emails that we send to
        you or, if no link is available, by replying with “unsubscribe” in the email title or body
        or by modifying your email settings within the Service. On rare occasions, some types of
        email are necessary for the Service and cannot be unsubscribed from if you continue to use
        the Service.
      </span>
      <H2>16. UPDATES</H2>
      <span>
        G9 Software reserves the right, in its sole discretion, to modify the Privacy Policy at any
        time (“Updates”) and shall make Updates available on G9 Software's website. You are deemed
        to accept Updates by continuing to use the Service. Unless G9 Software states otherwise,
        Updates are automatically effective 30 days after posting on G9 Software website.
      </span>
      <H2>17. CONTACT US</H2>
      <span>
        If you have requests, questions or comments about the Privacy Policy or our data collection
        in general, please contact our Data Protection Officer at contact@g9software.xyz or at:
      </span>
      <span>
        Twitter Account:{' '}
        <Link href='https://twitter.com/g9software' target='_blank' className='text-pt-teal'>
          @g9software
        </Link>
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

const List = (props: { children: ReactNode }) => {
  return <ul className='pl-6'>{props.children}</ul>
}
