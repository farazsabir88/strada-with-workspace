import React from 'react';
import { Grid, Box } from '@mui/material';
import './_dualColumnsVideo.scss';

interface Props {
  text: string;
  heading: string;
  type: string;
  media: string;
  src: string;
}
export default function DualColumnsVideo(props: Props): JSX.Element {
  const {
    text,
    heading,
    src,
    type,
    media,
  } = props;
  return (
    <div className='content-container'>
      <div className='container'>
        <Grid container className='dual-column-video-block'>
          { type === 'left' ? (
            <>
              <Grid item lg={6} sm={12} className='content-column'>
                <Box>
                  <p className='intro-slogan text-center-md'>{heading}</p>
                  <p className='intro-desc text-center-md'>
                    {text}
                  </p>
                </Box>
              </Grid>
              <Grid item lg={6} sm={12} className='video-column-right'>
                {media === 'video' ? (
                  <video autoPlay loop muted playsInline>
                    <source
                      src={src}
                      type='video/mp4'
                    />
                  </video>
                ) : <img src={src} alt='' />}

              </Grid>
            </>
          ) : (
            <>

              <Grid item lg={6} sm={12} className='video-column-left'>
                {media === 'video' ? (
                  <video autoPlay loop muted playsInline>
                    <source
                      src={src}
                      type='video/mp4'
                    />
                  </video>
                ) : <img src={src} alt='' />}

              </Grid>
              <Grid item lg={6} sm={12} className='content-column'>
                <Box>
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
