/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import './_privacyPolicy.scss';
import { Link, Element } from 'react-scroll';

function Content(): JSX.Element {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Grid container className='container privacy-content'>
      <Grid pl={{ sm: 5, lg: 10 }} mt={2} sm={5} item>
        <div className='heading-table'>
          <div className='heading-inner-table-box'>
            <Link
              activeClass='active'
              to='Information We Collect'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p> Information We Collect</p>
            </Link>
            <Link
              activeClass='active'
              to='Why We Collect Information and For How Long'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>Why We Collect Information and For How Long</p>
            </Link>
            <Link
              activeClass='active'
              to='Google User Data'
              smooth
              duration={80}
              offset={-110}
              isDynamic
              delay={0}
              spy
            >
              <p>Google User Data</p>
            </Link>
            <Link
              activeClass='active'
              to='Use of Information Collected'
              smooth
              duration={80}
              offset={-110}
              isDynamic
              delay={0}
              spy
            >
              <p>Use of Information Collected</p>
            </Link>
            <Link
              activeClass='active'
              to='Disclosure of Information'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>Disclosure of Information </p>
            </Link>
            <Link
              activeClass='active'
              to='Non-Marketing Purposes'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>Non-Marketing Purposes </p>
            </Link>
            <Link
              activeClass='active'
              to='Children under the age of 13'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>Children under the age of 13 </p>
            </Link>
            <Link
              activeClass='active'
              to='Unsubscribe or Opt-Out'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>Unsubscribe or Opt-Out </p>
            </Link>
            <Link
              activeClass='active'
              to='Links to Other Websites'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>Links to Other Websites</p>
            </Link>
            <Link
              activeClass='active'
              to='Notice to European Union Users'
              smooth
              duration={80}
              offset={-130}
              isDynamic
              delay={0}
              spy
            >
              <p>Notice to European Union Users</p>
            </Link>
            <Link
              activeClass='active'
              to='Security'
              smooth
              duration={80}
              offset={-130}
              isDynamic
              delay={0}
              spy
            >
              <p>Security</p>
            </Link>
            <Link
              activeClass='active'
              to='Acceptance of Terms'
              smooth
              duration={80}
              offset={-130}
              isDynamic
              delay={0}
              spy
            >
              <p>Acceptance of Terms</p>
            </Link>
            <Link
              activeClass='active '
              to='How to Contact Us'
              smooth
              duration={80}
              offset={-130}
              isDynamic
              delay={0}
              spy
            >
              <p>How to Contact Us</p>
            </Link>
          </div>
        </div>
      </Grid>
      <Grid sm={6} item mt={2}>
        {/*  section-1 */}
        <p className='privacy-policy-heading'>Privacy Policy</p>
        <p className='privacy-policy-paragraph'>
          Strada Technologies, Inc. (Strada) values its user's privacy. This
          Privacy Policy ("Policy") will help you understand how we collect and
          use personal information from those who visit our website or make use
          of our online facilities and services, and what we will and will not
          do with the information we collect. Our Policy has been designed and
          created to ensure those affiliated with Strada Technologies, Inc. of
          our commitment and realization of our obligation not only to meet, but
          to exceed, most existing privacy standards.
        </p>
        <p className='privacy-policy-paragraph'>
          We reserve the right to make changes to this Policy at any given time.
          If you want to make sure that you are up to date with the latest
          changes, we advise you to frequently visit this page. If at any point
          in time Strada Technologies, Inc. decides to make use of any
          personally identifiable information on file, in a manner vastly
          different from that which was stated when this information was
          initially collected, the user or users shall be promptly notified by
          email. Users at that time shall have the option as to whether to
          permit the use of their information in this separate manner.
        </p>
        <p className='privacy-policy-paragraph'>
          This Policy applies to Strada Technologies, Inc. , and it governs any
          and all data collection and usage by us. Through the use of Strada.ai,
          you are therefore consenting to the data collection procedures
          expressed in this Policy. Please note that this Policy does not govern
          the collection and use of information by companies that Strada
          Technologies, Inc. does not control, nor by inpiduals not employed or
          managed by us. If you visit a website that we mention or link to, be
          sure to review its privacy policy before providing the site with
          information. It is highly recommended and suggested that you review
          the privacy policies and statements of any website you choose to use
          or frequent to better understand the way in which websites garner,
          make use of and share the information collected.
        </p>
        <p className='privacy-policy-paragraph-no-space'>
          Specifically, this Policy will inform you of the following
        </p>
        <p className='privacy-policy-paragraph-no-space'>
          1. What personally identifiable information is collected from you
          through our website;
        </p>
        <p className='privacy-policy-paragraph-no-space'>
          2. Why we collect personally identifiable information and the legal
          basis for such collection;
        </p>
        <p className='privacy-policy-paragraph-no-space'>
          3. How we use the collected information and with whom it may be
          shared;
          {' '}
        </p>
        <p className='privacy-policy-paragraph-no-space'>
          4. What choices are available to you regarding the use of your data;
          and
          {' '}
        </p>
        <p className='privacy-policy-paragraph-no-space'>
          5. The security procedures in place to protect the misuse of your
          information.
        </p>
        {/*   section-2 */}
        <Element name='Information We Collect'>
          <p className='privacy-policy-sub-heading'>Information We Collect</p>
          <p className='privacy-policy-paragraph'>
            Strada Technologies, Inc. (Strada) values its user's privacy. This
            Privacy Policy ("Policy") will help you understand how we collect
            and use personal information from those who visit our website or
            make use of our online facilities and services, and what we will and
            will not do with the information we collect. Our Policy has been
            designed and created to ensure those affiliated with Strada
            Technologies, Inc. of our commitment and realization of our
            obligation not only to meet, but to exceed, most existing privacy
            standards.
          </p>
          <p className='privacy-policy-paragraph'>
            We reserve the right to make changes to this Policy at any given
            time. If you want to make sure that you are up to date with the
            latest changes, we advise you to frequently visit this page. If at
            any point in time Strada Technologies, Inc. decides to make use of
            any personally identifiable information on file, in a manner vastly
            different from that which was stated when this information was
            initially collected, the user or users shall be promptly notified by
            email. Users at that time shall have the option as to whether to
            permit the use of their information in this separate manner.
          </p>
          <p className='privacy-policy-paragraph'>
            This Policy applies to Strada Technologies, Inc. , and it governs
            any and all data collection and usage by us. Through the use of
            Strada.ai, you are therefore consenting to the data collection
            procedures expressed in this Policy. Please note that this Policy
            does not govern the collection and use of information by companies
            that Strada Technologies, Inc. does not control, nor by inpiduals
            not employed or managed by us. If you visit a website that we
            mention or link to, be sure to review its privacy policy before
            providing the site with information. It is highly recommended and
            suggested that you review the privacy policies and statements of any
            website you choose to use or frequent to better understand the way
            in which websites garner, make use of and share the information
            collected.
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            Specifically, this Policy will inform you of the following
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            1. What personally identifiable information is collected from you
            through our website;
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            2. Why we collect personally identifiable information and the legal
            basis for such collection;
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            3. How we use the collected information and with whom it may be
            shared;
            {' '}
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            4. What choices are available to you regarding the use of your data;
            and
            {' '}
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            5. The security procedures in place to protect the misuse of your
            information.
          </p>
        </Element>
        {' '}
        {/*   section-3 */}
        <Element name='Why We Collect Information and For How Long'>
          <p className='privacy-policy-sub-heading'>
            Why We Collect Information and For How Long
          </p>
          <p className='privacy-policy-paragraph '>
            We are collecting your data for several reasons:
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • To better understand your needs and provide you with the services
            you have requested;
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • To fulfill our legitimate interest in improving our services and
            products;
            {' '}
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • To send you promotional emails containing information we think you
            may like when we have your consent to do so;
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • To contact you to fill out surveys or participate in other types
            of market research, when we have your consent to do so;
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • To customize our website according to your online behavior and
            personal preferences.
            {' '}
          </p>
          <p className='privacy-policy-paragraph'>
            The data we collect from you will be stored for no longer than
            necessary. The length of time we retain said information will be
            determined based upon the following criteria: the length of time
            your personal information remains relevant; the length of time it is
            reasonable to keep records to demonstrate that we have fulfilled our
            duties and obligations; any limitation periods within which claims
            might be made; any retention periods prescribed by law or
            recommended by regulators, professional bodies or associations; the
            type of contract we have with you, the existence of your consent,
            and our legitimate interest in keeping such information as stated in
            this Policy.
          </p>
        </Element>
        {' '}
        {/*   section-4 */}
        <Element name='Google User Data'>
          <p className='privacy-policy-sub-heading'>Google User Data</p>
          <p className='privacy-policy-paragraph'>
            Additional limits on use of your Google user data: Notwithstanding
            anything else in this Privacy Policy, consumer Gmail account
            information obtained via the Gmail APIs , is subject to these
            additional restrictions:
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • The Services may read, write, modify, delete or control Gmail
            message bodies (including attachments), metadata, headers, and
            settings to provide an email client that allows users to compose,
            send, read, delete and process emails and will not transfer this
            Gmail data to others unless doing so is necessary to provide and
            improve these features, comply with applicable law, or as part of a
            merger, acquisition, or sale of assets.
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • The Services will not use this Gmail data for serving
            advertisements.
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • The Services will not allow humans to read this data unless we
            have your afﬁrmative agreement for speciﬁc messages, doing so is
            necessary for security purposes such as investigating abuse, to
            comply with applicable law, or for the Services’ internal operations
            and even then only when the data have been aggregated and
            de-identified.
          </p>
        </Element>
        {/*   section-5 */}
        <Element name='Use of Information Collected'>
          <p className='privacy-policy-sub-heading'>
            Use of Information Collected
          </p>
          <p className='privacy-policy-paragraph'>
            Strada Technologies, Inc. does not now, nor will it in the future,
            sell, rent or lease any of its customer lists and/or names to any
            third parties. Strada Technologies, Inc. may collect and may make
            use of personal information to assist in the operation of our
            website and to ensure delivery of the services you need and request.
            At times, we may find it necessary to use personally identifiable
            information as a means to keep you informed of other possible
            products and/or services that may be available to you from Strada.ai
            Strada Technologies, Inc. may also be in contact with you with
            regards to completing surveys and/or research questionnaires related
            to your opinion of current or potential future services that may be
            offered.
          </p>
        </Element>
        {/*   section-6 */}
        <Element name='Disclosure of Information'>
          <p className='privacy-policy-sub-heading'>
            Disclosure of Information
          </p>
          <p className='privacy-policy-paragraph'>
            Strada Technologies, Inc. may not use or disclose the information
            provided by you except under the following circumstances: · as
            necessary to provide services or products you have ordered; · in
            other ways described in this Policy or to which you have otherwise
            consented; · in the aggregate with other information in such a way
            so that your identity cannot reasonably be determined; · as required
            by law, or in response to a subpoena or search warrant; · to outside
            auditors who have agreed to keep the information confidential; · as
            necessary to enforce the Terms of Service; · as necessary to
            maintain, safeguard and preserve all the rights and property
            ofStrada Technologies, Inc.
          </p>
        </Element>
        {/*   section-7 */}
        <Element name='Non-Marketing Purposes'>
          <p className='privacy-policy-sub-heading'>Non-Marketing Purposes</p>
          <p className='privacy-policy-paragraph'>
            Strada Technologies, Inc. may not use or disclose the information
            provided by you except under the following circumstances:
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • As necessary to provide services or products you have ordered;
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • In other ways described in this Policy or to which you have
            otherwise consented;
            {' '}
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • In the aggregate with other information in such a way so that your
            identity cannot reasonably be determined;
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • As required by law, or in response to a subpoena or search
            warrant;
            {' '}
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • To outside auditors who have agreed to keep the information
            confidential;
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • As necessary to enforce the Terms of Service;
            {' '}
          </p>
          <p className='privacy-policy-paragraph-no-space'>
            • As necessary to maintain, safeguard and preserve all the rights
            and property ofStrada Technologies, Inc.
          </p>
          {' '}
        </Element>
        {/*   section-8 */}
        <Element name='Children under the age of 13'>
          <p className='privacy-policy-sub-heading'>
            Children under the age of 13
          </p>

          <p className='privacy-policy-paragraph'>
            Strada Technologies, Inc. 's website is not directed to, and does
            not knowingly collect personal identifiable information from,
            children under the age of thirteen (13). If it is determined that
            such information has been inadvertently collected on anyone under
            the age of thirteen (13), we shall immediately take the necessary
            steps to ensure that such information is deleted from our system's
            database, or in the alternative, that verifiable parental consent is
            obtained for the use and storage of such information. Anyone under
            the age of thirteen (13) must seek and obtain parent or guardian
            permission to use this website.
          </p>
        </Element>
        {/*   section-9 */}
        <Element name='Unsubscribe or Opt-Out'>
          <p className='privacy-policy-sub-heading'>Unsubscribe or Opt-Out</p>
          <p className='privacy-policy-paragraph'>
            Strada Technologies, Inc. 's website is not directed to, and does
            not knowingly collect personal identifiable information from,
            children under the age of thirteen (13). If it is determined that
            such information has been inadvertently collected on anyone under
            the age of thirteen (13), we shall immediately take the necessary
            steps to ensure that such information is deleted from our system's
            database, or in the alternative, that verifiable parental consent is
            obtained for the use and storage of such information. Anyone under
            the age of thirteen (13) must seek and obtain parent or guardian
            permission to use this website.All users and visitors to our website
            have the option to discontinue receiving communications from us by
            way of email or newsletters. To discontinue or unsubscribe from our
            website please send an email that you wish to unsubscribe to
            {' '}
            <a
              href='mailto:feedback@strada.ai'
              className='privacy-policy-email-link'
            >
              feedback@strada.ai
            </a>
            {' '}
            If you wish to unsubscribe or opt-out from any third-party websites,
            you must go to that specific website to unsubscribe or optout.
            Strada Technologies, Inc. will continue to adhere to this Policy
            with respect to any personal information previously collected.
          </p>
        </Element>
        {/*   section-10 */}
        <Element name='Links to Other Websites'>
          <p className='privacy-policy-sub-heading'>Links to Other Websites</p>
          <p className='privacy-policy-paragraph'>
            Our website does contain links to affiliate and other
            websites.Strada Technologies, Inc. does not claim nor accept
            responsibility for any privacy policies, practices and/or procedures
            of other such websites. Therefore, we encourage all users and
            visitors to be aware when they leave our website and to read the
            privacy statements of every website that collects personally
            identifiable information. This Privacy Policy Agreement applies only
            and solely to the information collected by our website.
          </p>
        </Element>
        {/*   section-11 */}
        <Element name='Notice to European Union Users'>
          <p className='privacy-policy-sub-heading'>
            Notice to European Union Users
          </p>
          <p className='privacy-policy-paragraph'>
            Strada Technologies, Inc. 's operations are located primarily in the
            United States. If you provide information to us, the information
            will be transferred out of the European Union (EU) and sent to the
            United States. (The adequacy decision on the EU-US Privacy became
            operational on August 1, 2016. This framework protects the
            fundamental rights of anyone in the EU whose personal data is
            transferred to the United States for commercial purposes. It allows
            the free transfer of data to companies that are certified in the US
            under the Privacy Shield.) By providing personal information to us,
            you are consenting to its storage and use as described in this
            Policy.
          </p>
        </Element>
        {/*   section-12 */}
        <Element name='Security'>
          <p className='privacy-policy-sub-heading'>Security</p>
          <p className='privacy-policy-paragraph'>
            Strada Technologies, Inc. takes precautions to protect your
            information. When you submit sensitive information via the website,
            your information is protected both online and offline. Wherever we
            collect sensitive information (e.g. credit card information), that
            information is encrypted and transmitted to us in a secure way. You
            can verify this by looking for a lock icon in the address bar and
            looking for "https" at the beginning of the address of the webpage.
            While we use encryption to protect sensitive information transmitted
            online, we also protect your information offline. Only employees who
            need the information to perform a specific job (for example, billing
            or customer service) are granted access to personally identifiable
            information. The computers and servers in which we store personally
            identifiable information are kept in a secure environment. This is
            all done to prevent any loss, misuse, unauthorized access,
            disclosure or modification of the user's personal information under
            our control. The company also uses Secure Socket Layer (SSL) for
            authentication and private communications to build users' trust and
            confidence in the internet and website use by providing simple and
            secure access and communication of credit card and personal
            information.
          </p>
        </Element>
        {/*   section-13 */}
        <Element name='Acceptance of Terms'>
          <p className='privacy-policy-sub-heading'>Acceptance of Terms</p>
          <p className='privacy-policy-paragraph'>
            By using this website, you are hereby accepting the terms and
            conditions stipulated within the Privacy Policy Agreement. If you
            are not in agreement with our terms and conditions, then you should
            refrain from further use of our sites. In addition, your continued
            use of our website following the posting of any updates or changes
            to our terms and conditions shall mean that you agree and acceptance
            of such changes.
          </p>
        </Element>
        {/*   section-14 */}
        <Element name='How to Contact Us'>
          <p className='privacy-policy-sub-heading'>How to Contact Us</p>
          <p className='privacy-policy-paragraph'>
            If you have any questions or concerns regarding the Privacy Policy
            Agreement related to our website, please feel free to contact us at
            the following email address:
            {' '}
            <a
              href='mailto:feedback@strada.ai'
              className='privacy-policy-email-link'
            >
              feedback@strada.ai
            </a>
          </p>
        </Element>
      </Grid>
    </Grid>
  );
}

export default Content;
