import React from 'react';
import Sidebar from 'admin/sidebar';
import PoApprovalContent from './PoApprovalContent';

export default function POApproval(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='po-approval' />
      <PoApprovalContent />
    </div>

  );
}
