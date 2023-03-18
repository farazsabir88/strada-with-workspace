import * as React from 'react';
import Sidebar from 'admin/sidebar';
import MemberContent from './MemberContent';
import './_members.scss';

export default function Members(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='members' />
      <MemberContent />
    </div>
  );
}
