import React from 'react';
import Content from './Content';
import Footer from '../footer/Footer';

function index(): JSX.Element {
  return (
    <>
      <Content />
      <Footer />
      {/* <!-- Start of HubSpot Embed Code --> */}
      <script type='text/javascript' id='hs-script-loader' async defer src='//js.hs-scripts.com/7523573.js' />
      {/* <!-- End of HubSpot Embed Code --> */}
    </>
  );
}

export default index;
