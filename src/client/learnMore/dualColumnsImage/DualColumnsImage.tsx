import React from 'react';
import { Grid, Box } from '@mui/material';
import './_dualColumnsImage.scss';

interface Iprops {
  text: string;
  heading: string;
  type: string;
  src: string;
  brief: string;
}
export default function DualColumnsVideo(props: Iprops): JSX.Element {
  const {
    text,
    heading,
    src,
    type,
    brief,
  } = props;
  return (
    <div className='learnmore-content'>
      <div className='container'>
        <Grid container className='dual-column-image-block'>
          { type === 'left' ? (
            <>
              <Grid item lg={6} sm={12} className='content-column'>
                <Box>
                  <p className='intro-brief'>{brief}</p>
                  <p className='intro-slogan text-center-md'>{heading}</p>
                  <p className='intro-desc text-center-md'>
                    {text}
                  </p>
                </Box>
              </Grid>
              <Grid item lg={6} sm={12} className='image-column-right'>
                <img src={src} alt='' />

              </Grid>
            </>
          ) : (
            <>
              <Grid item lg={6} sm={12} className='image-column-left'>
                <img src={src} alt='' />
              </Grid>
              <Grid item lg={6} sm={12} className='content-column'>
                <Box>
                  <p className='intro-brief'>{brief}</p>
                  <p className='intro-slogan text-center-md'>{heading}</p>
                  <p className='intro-desc text-center-md'>
                    {text}
                  </p>
                </Box>
              </Grid>
            </>
          ) }
        </Grid>
      </div>
    </div>
  );
}
