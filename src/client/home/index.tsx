import React from 'react';
import './_hero.scss';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UnpaidCharges from 'assests/videos/Mailbox.mp4';
import Puzzle from 'assests/images/Puzzle.gif';
import Invoices from 'assests/videos/Invoices.mp4';
import COIs from 'assests/videos/COIs.mp4';
import PMS from 'assests/images/PMS.gif';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import Footer from '../footer/Footer';
import DualColumnsVideo from './dualColumnsVideo/DualColumnsVideo';
import Hero from './Hero';

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  return (
    <>
      <Hero />
      <div className='container'>
        <DualColumnsVideo media='video' type='left' heading='Unpaid Charges' src={UnpaidCharges} text='One click tenant outreach includes information on unpaid charges with auto generated invoices.' />
        <DualColumnsVideo media='video' type='right' heading='Invoices' src={Invoices} text='Self learning technology to process invoices quicker and more accurately than ever.' />

        <DualColumnsVideo media='video' type='left' heading='COIs' src={COIs} text='Machine captured COI information instantly detects deficient certificates and sends notice to non compliant vendors..' />
        <DualColumnsVideo
          media='img'
          type='right'
          heading='Works with your Calendar and email'
          src={Puzzle}
          text='Send scheduling links to vendors that sync with your calendar and
        cut out time consuming back and forth meeting scheduling.
        Get instant notifications when a vendor or building engineer has scheduled for an upcoming job. All necessary tenant and vendor outreach is sent via your outlook or gmail account, making it simple to track and manage all communication.'
        />
        <DualColumnsVideo
          media='gif'
          type='left'
          heading='Integrated to your Property Management Software'
          src={PMS}
          text='We’ve partnered with your PMS for a turbo charged, seamless solution. Strada analyzes your budgeted items and makes it simple and intuitive to manage, track, schedule and communicate all necessary building events. No need to duplicate any information - you’re ready to go, instantly.'
        />
        <Grid className='container'>

          <p className='header-bottom'>Ready to use Strada?</p>
          <div className='header-bottom-home'>

            <SecondaryButton fullWidth={false} onClick={(): void => { navigate('/requestdemo'); }}> Request Demo</SecondaryButton>

          </div>

        </Grid>
      </div>
      <Footer />
      {/* <!-- Start of HubSpot Embed Code --> */}
      <script type='text/javascript' id='hs-script-loader' async defer src='//js.hs-scripts.com/7523573.js' />
      {/* <!-- End of HubSpot Embed Code --> */}
    </>
  );
}
