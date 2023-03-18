import React from 'react';
import './_footer.scss';
import { Divider, Grid } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

function Footer(): JSX.Element {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div>

      {pathname === '/' || pathname === '/learn-more' || pathname === '/contact-us' ? (
        <div className='footer-container'>
          <Divider className='mt-5' />
          <div className='container'>

            <Grid container className='footer'>

              <Grid item sm={2} className='footer-col'>

                <ul className='nav'>
                  <li>
                    <p className='footer-title'>Product</p>
                  </li>
                  <li>
                    <Link to='/'><p className='footer-link'>Home</p></Link>
                  </li>
                  <li>
                    <Link to='/learn-more'><p className='footer-link'>Learn More</p></Link>
                  </li>

                </ul>

              </Grid>
              <Grid item sm={2} className='footer-col'>
                <ul className='nav'>
                  <li>
                    <p className='footer-title'>Resources</p>
                  </li>
                  <li>
                    <Link to='/terms-and-conditions'><p className='footer-link'>Terms Of Use</p></Link>
                  </li>
                  <li>
                    <Link to='/privacy-policy'><p className='footer-link'>Privacy Policy</p></Link>
                  </li>
                  <li>
                    <Link to='/contactus'><p className='footer-link'>Contact Us</p></Link>
                  </li>
                </ul>
              </Grid>

              <Grid item sm={7} className='footer-col'>
                <ul className='nav'>
                  <li>
                    <p className='footer-title'>Questions?</p>
                  </li>
                  <li>
                    <a href='mailto:info@strada.ai'><p className='footer-link'>info@strada.ai</p></a>
                  </li>
                </ul>
              </Grid>
              <Grid item sm={1} className='footer-col' />
              <p className='footer-item'>© STRADA TECHNOLOGIES INC.</p>
            </Grid>

          </div>
        </div>
      )
        : (
          <Grid container className='auth-pages-footer'>
            <Grid item sm={6} className='text-center text-center'>© STRADA TECHNOLOGIES INC.</Grid>
            <Grid item sm={6} className='footer-col text-center'>
              <a href='mailto:info@strada.ai' className='text-decoration-none'><p className='footer-link' style={{ color: 'rgba(33,33,33,.6)' }}>info@strada.ai</p></a>
            </Grid>
          </Grid>
        )}
    </div>
  );
}

export default Footer;
