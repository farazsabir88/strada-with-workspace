import React from 'react';
import Sidebar from 'admin/sidebar';
import PurchaseOrderContent from 'admin/purchaseOrder/PurchaseOrderContent';
import 'admin/purchaseOrder/_purchaseOrder.scss';

export default function PurchaseOrders(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='purchase-order' />
      <PurchaseOrderContent />
    </div>
  );
}
