import React from 'react';
import Footer from '../footer/Footer';
import Content from './Content';

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
