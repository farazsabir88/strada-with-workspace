import React from 'react';
import './_buildingDashboard.scss';
import Header from './components/Header';
import Tabs from './components/Tabs';

export default function BuildingDashboard(): JSX.Element {
  return (
    <div className='building-wrapper'>
      <Header />
      <Tabs />
    </div>

  );
}
