/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import '../privacyPolicy/_privacyPolicy.scss';
import {
  Link, Element,
} from 'react-scroll';

function Content(): JSX.Element {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Grid container className='container privacy-content'>
      <Grid pl={{ sm: 5, lg: 10 }} mt={3} sm={5} item>
        <div className='heading-table'>
          <div className='heading-inner-table-box'>

            <Link
              activeClass='active'
              to='Agreement between User and strada.ai'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p> Agreement between User and strada.ai</p>
            </Link>
            <Link
              activeClass='active'
              to='Privacy'
              smooth
              duration={80}
              offset={-70}
              isDynamic
              delay={0}
              spy
            >
              <p>Privacy</p>
            </Link>
            <Link
              activeClass='active'
              to='Electronic Communications'
              smooth
              duration={80}
              offset={-90}
              isDynamic
              delay={0}
              spy
            >
              <p>Electronic Communications</p>
            </Link>
            <Link
              activeClass='active'
              to='Your Account'
              smooth
              duration={80}
              offset={-110}
              isDynamic
              delay={0}
              spy
            >
              <p>Your Account</p>
            </Link>
            <Link
              activeClass='active'
              to='Children Under Thirteen'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>Children Under Thirteen</p>
            </Link>
            <Link
              activeClass='active'
              to='Links to Third Party Sites/Third Party Services'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>Links to Third Party Sites/Third Party Services </p>
            </Link>
            <Link
              activeClass='active'
              to='No Unlawful or Prohibited Use/Intellectual Property'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>No Unlawful or Prohibited Use/Intellectual Property </p>
            </Link>
            <Link
              activeClass='active'
              to='International Users'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>International Users </p>
            </Link>
            <Link
              activeClass='active'
              to='Indemnification'
              smooth
              duration={80}
              offset={-100}
              isDynamic
              delay={0}
              spy
            >
              <p>Indemnification</p>
            </Link>
            <Link
              activeClass='active'
              to='Arbitration'
              smooth
              duration={80}
              offset={-130}
              isDynamic
              delay={0}
              spy
            >
              <p>Arbitration</p>
            </Link>
            <Link
              activeClass='active'
              to='Liability Disclaimer'
              smooth
              duration={80}
              offset={-130}
              isDynamic
              delay={0}
              spy
            >
              <p>Liability Disclaimer</p>
            </Link>
            <Link
              activeClass='active'
              to='Termination/Access Restriction'
              smooth
              duration={80}
              offset={-130}
              isDynamic
              delay={0}
              spy
            >
              <p>Termination/Access Restriction</p>
            </Link>
            <Link
              activeClass='active '
              to='Changes to Terms'
              smooth
              duration={80}
              offset={-130}
              isDynamic
              delay={0}
              spy
            >
              <p>Changes to Terms</p>
            </Link>
            <Link
              activeClass='active '
              to='Contact Us'
              smooth
              duration={80}
              offset={-130}
              isDynamic
              delay={0}
              spy
            >
              <p>Contact Us</p>
            </Link>

          </div>

        </div>
      </Grid>
      <Grid item sm={6} mt={2}>

        {/*  section-1 */}
        <p className='privacy-policy-heading'>Terms Of Use</p>

        {/*   section-2 */}
        <Element name='Agreement between User and strada.ai'>
          <p className='privacy-policy-sub-heading'>Agreement between User and strada.ai</p>
          <p className='privacy-policy-paragraph'>Welcome to strada.ai. The strada.ai website (the "Site") is comprised of various web pages operated by Strada Technologies, Inc. ("Strada"). strada.ai is offered to you conditioned on your acceptance without modification of the terms, conditions, and notices contained herein (the "Terms"). Your use of strada.ai constitutes your agreement to all such Terms. Please read these terms carefully, and keep a copy of them for your reference.</p>
        </Element>
        {' '}
        {/*   section-3 */}
        <Element name='Privacy'>
          <p className='privacy-policy-sub-heading'>Privacy</p>
          <p className='privacy-policy-paragraph'>
            Your use of strada.ai is subject to Strada's Privacy Policy. Please review our
            {' '}
            <a href='/privacy-policy' className='privacy-policy-email-link'> Privacy Policy </a>
            which also governs the Site and informs users of our data collection practices.
          </p>

        </Element>
        {' '}
        {/*   section-4 */}
        <Element name='Electronic Communications'>
          <p className='privacy-policy-sub-heading'>Electronic Communications</p>
          <p className='privacy-policy-paragraph'>
            Visiting strada.ai or sending emails to Strada constitutes electronic communications. You consent to receive electronic communications and you agree that all agreements, notices, disclosures and other communications that we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communications be in writing.
          </p>

        </Element>
        {/*   section-5 */}
        <Element name='Your Account'>
          <p className='privacy-policy-sub-heading'>Your Account</p>
          <p className='privacy-policy-paragraph'>If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. You may not assign or otherwise transfer your account to any other person or entity. You acknowledge that Strada is not responsible for third party access to your account that results from theft or misappropriation of your account. Strada and its associates reserve the right to refuse or cancel service, terminate accounts, or remove or edit content in our sole discretion.</p>
        </Element>
        {/*   section-6 */}
        <Element name='Children Under Thirteen'>
          <p className='privacy-policy-sub-heading'>Children Under Thirteen</p>
          <p className='privacy-policy-paragraph'>Strada does not knowingly collect, either online or offline, personal information from persons under the age of thirteen. If you are under 18, you may use strada.ai only with permission of a parent or guardian.</p>
        </Element>
        {/*   section-7 */}
        <Element name='Links to Third Party Sites/Third Party Services'>
          <p className='privacy-policy-sub-heading'>Links to Third Party Sites/Third Party Services</p>
          <p className='privacy-policy-paragraph'>Strada.ai may contain links to other websites ("Linked Sites"). The Linked Sites are not under the control of Strada and Strada is not responsible for the contents of any Linked Site, including without limitation any link contained in a Linked Site, or any changes or updates to a Linked Site. Strada is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by Strada of the site or any association with its operators. Certain services made available via strada.ai are delivered by third party sites and organizations. By using any product, service or functionality originating from the strada.ai domain, you hereby acknowledge and consent that Strada may share such information and data with any third party with whom Strada has a contractual relationship to provide the requested product, service or functionality on behalf of strada.ai users and customers.</p>

        </Element>

        {/*   section-8 */}

        <Element name='No Unlawful or Prohibited Use/Intellectual Property'>
          <p className='privacy-policy-sub-heading'>No Unlawful or Prohibited Use/Intellectual Property</p>

          <p className='privacy-policy-paragraph'>You are granted a non-exclusive, non-transferable, revocable license to access and use strada.ai strictly in accordance with these terms of use. As a condition of your use of the Site, you warrant to Strada that you will not use the Site for any purpose that is unlawful or prohibited by these Terms. You may not use the Site in any manner which could damage, disable, overburden, or impair the Site or interfere with any other party's use and enjoyment of the Site. You may not obtain or attempt to obtain any materials or information through any means not intentionally made available or provided for through the Site.</p>
          <p className='privacy-policy-paragraph'>All content included as part of the Service, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the Site, is the property of Strada or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights. You agree to observe and abide by all copyright and other proprietary notices, legends or other restrictions contained in any such content and will not make any changes thereto.</p>
          <p className='privacy-policy-paragraph'>You will not modify, publish, transmit, reverse engineer, participate in the transfer or sale, create derivative works, or in any way exploit any of the content, in whole or in part, found on the Site. Strada content is not for resale. Your use of the Site does not entitle you to make any unauthorized use of any protected content, and in particular you will not delete or alter any proprietary rights or attribution notices in any content. You will use protected content solely for your personal use, and will make no other use of the content without the express written permission of Strada and the copyright owner. You agree that you do not acquire any ownership rights in any protected content. We do not grant you any licenses, express or implied, to the intellectual property of Strada or our licensors except as expressly authorized by these Terms.</p>

        </Element>
        {/*   section-9 */}

        <Element name='International Users'>
          <p className='privacy-policy-sub-heading'>International Users</p>
          <p className='privacy-policy-paragraph'>The Service is controlled, operated and administered by Strada from our offices within the USA. If you access the Service from a location outside the USA, you are responsible for compliance with all local laws. You agree that you will not use the Strada Content accessed through strada.ai in any country or in any manner prohibited by any applicable laws, restrictions or regulations.</p>

        </Element>
        {/*   section-10 */}

        <Element name='Indemnification'>
          <p className='privacy-policy-sub-heading'>Indemnification</p>
          <p className='privacy-policy-paragraph'>You agree to indemnify, defend and hold harmless Strada, its officers, directors, employees, agents and third parties, for any losses, costs, liabilities and expenses (including reasonable attorney's fees) relating to or arising out of your use of or inability to use the Site or services, any user postings made by you, your violation of any terms of this Agreement or your violation of any rights of a third party, or your violation of any applicable laws, rules or regulations. Strada reserves the right, at its own cost, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with Strada in asserting any available defenses.</p>

        </Element>
        {/*   section-11 */}

        <Element name='Arbitration'>
          <p className='privacy-policy-sub-heading'>Arbitration</p>
          <p className='privacy-policy-paragraph'>
            In the event the parties are not able to resolve any dispute between them arising out of or concerning these Terms and Conditions, or any provisions hereof, whether in contract, tort, or otherwise at law or in equity for damages or any other relief, then such dispute shall be resolved only by final and binding arbitration pursuant to the Federal Arbitration Act, conducted by a single neutral arbitrator and administered by the American Arbitration Association, or a similar arbitration service selected by the parties, in a location mutually agreed upon by the parties. The arbitrator's award shall be final, and judgment may be entered upon it in any court having jurisdiction. In the event that any legal or equitable action, proceeding or arbitration arises out of or concerns these Terms and Conditions, the prevailing party shall be entitled to recover its costs and reasonable attorney's fees. The parties agree to arbitrate all disputes and claims in regards to these Terms and Conditions or any disputes arising as a result of these Terms and Conditions, whether directly or indirectly, including Tort claims that are a result of these Terms and Conditions. The parties agree that the Federal Arbitration Act governs the interpretation and enforcement of this provision. The entire dispute, including the scope and enforceability of this arbitration provision shall be determined by the Arbitrator. This arbitration provision shall survive the termination of these Terms and Conditions.
          </p>

        </Element>
        {/*   section-12 */}

        <Element name='Liability Disclaimer'>
          <p className='privacy-policy-sub-heading'>Liability Disclaimer</p>
          <p className='privacy-policy-paragraph'>THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR AVAILABLE THROUGH THE SITE MAY INCLUDE INACCURACIES OR TYPOGRAPHICAL ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE INFORMATION HEREIN. STRADA TECHNOLOGIES, INC. AND/OR ITS SUPPLIERS MAY MAKE IMPROVEMENTS AND/OR CHANGES IN THE SITE AT ANY TIME. STRADA TECHNOLOGIES, INC. AND/OR ITS SUPPLIERS MAKE NO REPRESENTATIONS ABOUT THE SUITABILITY, RELIABILITY, AVAILABILITY, TIMELINESS, AND ACCURACY OF THE INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS CONTAINED ON THE SITE FOR ANY PURPOSE. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ALL SUCH INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS ARE PROVIDED "AS IS" WITHOUT WARRANTY OR CONDITION OF ANY KIND. STRADA TECHNOLOGIES, INC.</p>
          <p className='privacy-policy-paragraph'>
            AND/OR ITS SUPPLIERS HEREBY DISCLAIM ALL WARRANTIES AND CONDITIONS WITH REGARD TO THIS INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS, INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL STRADA TECHNOLOGIES, INC. AND/OR ITS SUPPLIERS BE LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF USE, DATA OR PROFITS, ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OR PERFORMANCE OF THE SITE, WITH THE DELAY OR INABILITY TO USE THE SITE OR RELATED SERVICES, THE PROVISION OF OR FAILURE TO PROVIDE SERVICES, OR FOR ANY INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS OBTAINED THROUGH THE SITE, OR OTHERWISE ARISING OUT OF THE USE OF THE SITE, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, EVEN IF STRADA TECHNOLOGIES, INC. OR ANY OF ITS SUPPLIERS HAS BEEN ADVISED OF THE POSSIBILITY OF DAMAGES. BECAUSE SOME STATES/JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, THE ABOVE LIMITATION MAY NOT APPLY TO YOU. IF YOU ARE DISSATISFIED WITH ANY PORTION OF THE SITE, OR WITH ANY OF THESE TERMS OF USE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE SITE.
          </p>

        </Element>
        {/*   section-13 */}

        <Element name='Termination/Access Restriction'>
          <p className='privacy-policy-sub-heading'>Termination/Access Restriction</p>
          <p className='privacy-policy-paragraph'>
            Strada reserves the right, in its sole discretion, to terminate your access to the Site and the related services or any portion thereof at any time, without notice. To the maximum extent permitted by law, this agreement is governed by the laws of the State of California and you hereby consent to the exclusive jurisdiction and venue of courts in California in all disputes arising out of or relating to the use of the Site. Use of the Site is unauthorized in any jurisdiction that does not give effect to all provisions of these Terms, including, without limitation, this section.

          </p>
          <p className='privacy-policy-paragraph'>
            You agree that no joint venture, partnership, employment, or agency relationship exists between you and Strada as a result of this agreement or use of the Site. Strada's performance of this agreement is subject to existing laws and legal process, and nothing contained in this agreement is in derogation of Strada's right to comply with governmental, court and law enforcement requests or requirements relating to your use of the Site or information provided to or gathered by Strada with respect to such use. If any part of this agreement is determined to be invalid or unenforceable pursuant to applicable law including, but not limited to, the warranty disclaimers and liability limitations set forth above, then the invalid or unenforceable provision will be deemed superseded by a valid, enforceable provision that most closely matches the intent of the original provision and the remainder of the agreement shall continue in effect.
          </p>
          <p className='privacy-policy-paragraph'>
            Unless otherwise specified herein, this agreement constitutes the entire agreement between the user and Strada with respect to the Site and it supersedes all prior or contemporaneous communications and proposals, whether electronic, oral or written, between the user and Strada with respect to the Site. A printed version of this agreement and of any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or relating to this agreement to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form. It is the express wish to the parties that this agreement and all related documents be written in English.
          </p>

        </Element>
        {/*   section-14 */}

        <Element name='Changes to Terms'>
          <p className='privacy-policy-sub-heading'>Changes to Terms</p>
          <p className='privacy-policy-paragraph'>
            Strada reserves the right, in its sole discretion, to change the Terms under which strada.ai is offered. The most current version of the Terms will supersede all previous versions. Strada encourages you to periodically review the Terms to stay informed of our updates.
          </p>

        </Element>
        {/*   section-14 */}

        <Element name='Contact Us'>
          <p className='privacy-policy-sub-heading'>Contact Us</p>
          <p className='privacy-policy-paragraph' />

          <p className='privacy-policy-paragraph-no-space'>Strada welcomes your questions or comments regarding the Terms:</p>
          <p className='privacy-policy-paragraph-no-space'>Strada Technologies, Inc.</p>
          <p className='privacy-policy-paragraph-no-space'>595 Pacific Avenue</p>
          <p className='privacy-policy-paragraph-no-space'>Email Address:</p>
          <p className='privacy-policy-paragraph-no-space'>
            {' '}
            <a href='mailto:feedback@strada.ai' className='privacy-policy-email-link'>feedback@strada.ai</a>
          </p>
          <p className='privacy-policy-paragraph-no-space'>Telephone number:</p>

          <p className='privacy-policy-paragraph'>Effective as of January 01, 2020</p>

        </Element>

      </Grid>

    </Grid>
  );
}

export default Content;
