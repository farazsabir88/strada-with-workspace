import React from 'react';
import './_customLoader.scss';

export default function CustomLoader(): JSX.Element {
  return (
    <div className='lds-ellipsis'>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}
