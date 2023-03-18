import * as React from 'react';
import './_invoicingDocument.scss';
import Sidebar from 'admin/sidebar';
import InvoicingDocumentContent from './InvoicingDocumentContent';

export default function InvoicingDocument(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='invoicing-document' />
      <InvoicingDocumentContent />
    </div>
  );
}
