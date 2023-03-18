import * as React from 'react';
import Sidebar from 'admin/sidebar';
import './_template.scss';
import UnpaidChargesEmailTemplate from './unpaidChargesEmailTemplate/UnpaidChargesEmailContent';
import InvoicingDocumentContent from './invoicingDocumentTemplate/InvoicingDocumentContent';
import COIContent from './COIDeficientNotification/COIContent';

export default function Template(): JSX.Element {
  return (
    <div className='outer-template-wrapper'>
      <Sidebar variant='settings' activeLink='templates' />
      <div className='inner-template-wrapper'>
        <UnpaidChargesEmailTemplate />
        <br />
        <InvoicingDocumentContent />
        <br />
        <COIContent />
        <br />
        <br />
      </div>
    </div>
  );
}
