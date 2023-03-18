/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface IStradaLoaderProps {
  open: boolean;
  message?: string | undefined;
  className?: string;
}
export default function StradaLoader(props: IStradaLoaderProps): JSX.Element {
  return (
    <div>
      <Backdrop
        sx={{ color: '#00CFA1', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        className={props.className}
        open={props.open}
      >
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        }}
        >
          <CircularProgress color='inherit' />
          <div style={{ color: 'white', marginTop: '12px', fontSize: '16px' }}>
            {' '}
            {props.message ?? 'Loading...'}
            {' '}
          </div>
        </div>
      </Backdrop>
    </div>
  );
}
