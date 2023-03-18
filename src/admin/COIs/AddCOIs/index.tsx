import React from 'react';
import Sidebar from 'admin/sidebar';
import DragDropContent from './DragDropContent';

export default function DragDrop(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='cois' />
      <DragDropContent />
    </div>
  );
}
