import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export interface SpinnerProps {
  open: boolean;
  message?: string;
  size?: number;
}

export default function StradaSpinner(props: SpinnerProps): JSX.Element {
  const { open, message = '', size = 18 } = props;
  if (open) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={size} />
        <p style={{
          fontSize: '11px', fontWeight: 500, color: '#21212199', marginLeft: '4px',
        }}
        >
          {' '}
          {message}
          ...
          {' '}
        </p>
      </Box>
    );
  }
  return <div />;
}

StradaSpinner.defaultProps = {
  message: 'Loading',
  size: 18,
};
