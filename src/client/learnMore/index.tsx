/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Grid, Fab } from '@mui/material';
import './_learnMore.scss';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import BugdetCalendar from 'assests/images/upcoming_event.png';
import UnpaidCharges from 'assests/images/unpaid_charges.png';
import Invoicing from 'assests/images/invoicing.png';
import COIs from 'assests/images/cois.png';
import FocusOnMatter from 'assests/images/focus_on_matter.png';
import Yardi from 'assests/images/yardi_shape.png';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import Footer from '../footer/Footer';
import SingleColumn from './SingleColumn';
import DualColumnsImage from './dualColumnsImage/DualColumnsImage';
import Hero from './Hero';

function index(): JSX.Element {
  const navigate = useNavigate();
  return (
    <div>
      <Hero />
      <DualColumnsImage brief='TASK MANAGEMENT' type='right' heading='Budget Calendar' src={BugdetCalendar} text='Keep track of all budgeted events as well as new events that come up. Move around the items you need, schedule with vendors and communicate with your team from one single real-time source of truth.' />
      <DualColumnsImage brief='KEEP IT SIMPLE' type='left' heading='Unpaid Charges' src={UnpaidCharges} text='Manage and track tenant unpaid charges within a single dashboard. Take the hassle out of tracking down these accounts receivable with invoices generated and delivered based on outstanding items. Receive status reports and seamlessly follow up with the tenants you need to.' />
      <DualColumnsImage
        brief='LEARNS AS YOU GO'
        type='right'
        heading='Invoicing'
        src={Invoicing}
        text='The more you process, the smarter it gets. Accounts and totals are populated with taxes and additional fees distributed appropriately. A digital stamp can be added to your invoice and uploads to your accounting software are easier than ever.'
      />
      <DualColumnsImage
        brief='ENSURE VENDOR COMPLIANCE'
        type='left'
        heading='COIS'
        src={COIs}
        text='Ensure that recieved liability insurance certificates are up to standards based on your vendor category requirements. Upload 10’s to 100’s of COIs at once to be analyzed and sorted. If a certificate you’ve received is deficient, a request for update report will be generated and ready to send at the tap of a button.'
      />
      <SingleColumn />
      <DualColumnsImage
        brief='TASK MANAGEMENT'
        type='left'
        heading='Focus on What Matters'
        src={FocusOnMatter}
        text='Property Management can be a tug-of-war between an endless list of administrative duties and finding time to get out to walk the properties and meet with tenants and vendors, ensuring the highest quality of service for your building.Strada was built to dramatically reduce the unnecessary burden of administrative juggling, allowing your team to focus on what matters most'
      />
      <Grid className='container learn-more-bottom'>
        <p className='header-bottom-learnmore'> Integrated to your Property Management Software</p>
        <div className='img-wrapper'>
          <Fab title='yardi'><img src={Yardi} alt='' /></Fab>
          {' '}
          &nbsp;   &nbsp;   &nbsp;  &nbsp;

          <Fab title='soon'><AddIcon /></Fab>
        </div>

        <p className='header-bottom-header'>Ready to use Strada?</p>
        <div className='header-bottom-learnmore'>
          <SecondaryButton fullWidth={false} onClick={(): void => { navigate('/requestdemo'); }}> Request Demo</SecondaryButton>

        </div>

      </Grid>
      <Footer />
      {/* <!-- Start of HubSpot Embed Code --> */}
      <script type='text/javascript' id='hs-script-loader' async defer src='//js.hs-scripts.com/7523573.js' />
      {/* <!-- End of HubSpot Embed Code --> */}
    </div>
  );
}

export default index;
