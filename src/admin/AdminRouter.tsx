import React from 'react';
import {
  Routes, Route, Navigate, useLocation,
} from 'react-router-dom';
import Navbar from './navbar';
import AccountSettings from './accountSettings';
import Details from './buildingSettings/details';
import VendorContacts from './buildingSettings/vendorContacts';
import ChartsOfAccounts from './buildingSettings/chartsOfAccounts';
import VendorCOI from './buildingSettings/vendorCOI';
import AddEditVendorCIO from './buildingSettings/vendorCOI/AddEditVendorCIO';
import POApproval from './buildingSettings/POApproval';
import InvoiceApproval from './buildingSettings/invoiceApproval';
import UnpaidChargesEmail from './buildingSettings/unpaidChargesEmail';
import AddEmailUnpaidChargesTemplate from './buildingSettings/unpaidChargesEmail/addTemplate';
import Integrations from './buildingSettings/integrations';
import UnpaidCharges from './unpaidCharges';
import COIDeficientNotification from './buildingSettings/COIDeficientNotification';
import COIDeficientNotificationAddTemplate from './buildingSettings/COIDeficientNotification/addTemplate';
import Template from './buildingSettings/template';
import TasksTemplates from './buildingSettings/taskTemplates';
import TasksAddTemplates from './buildingSettings/taskTemplates/addTemplate';
import InvoicingDocument from './buildingSettings/invoicingDocument';
import InvoicingDocumentAddTemplate from './buildingSettings/invoicingDocument/addTemplate';
import AnnualBudgets from './buildingSettings/annualBudgets';
import COIs from './COIs';
import PdfViewerCOI from './COIs/pdfViewer';
import AddCOIs from './COIs/AddCOIs';
import COIsErrors from './COIs/COIsErrorTemplate';
import NewBuilding from './buildingSection/create-building';
import NewPurchaseOrder from './purchaseOrder/NewPurchaseOrder';
import EditPurchaseOrder from './purchaseOrder/EditPurchaseOrder';
import PurchaseOrders from './purchaseOrder';
import BuildingDashboard from './buildingSection/building-dashboard';
import ChecklistTemplates from './buildingSettings/template/ChecklistTemplates';
import CreateChecklistTemplate from './buildingSettings/template/ChecklistTemplates/createChecklistTemplate';
import Checklists from './checklists';
import ViewChecklist from './checklists/viewChecklist/index';
import PurchaseOrderApproval from './purchaseOrder/PurchaseOrderApproval';
import RFPModule from './RFP';
import RFP from './buildingSettings/RFPForm';
import AddOrEditRFP from './buildingSettings/RFPForm/addOrEditForm';
import WorkSpacesListing from './workSpaces/index';
import CreateWorkspace from './workSpaces/CreateWorkspace';
import BudgetCalendar from './buildingSection/budget-calendar/index';
import EventSchedule from './buildingSection/budget-calendar/EventSchedule/index';
import VendorSchedule from './buildingSection/budget-calendar/VendorSchedule';
import RFPSchedulingForm from './buildingSection/budget-calendar/EventSchedule/RFPSchedulingForm';
import Buildings from './buildingSettings/buildings';
import ViewBuilding from './buildingSettings/buildings/ViewBuilding';
import EditBuilding from './buildingSettings/buildings/edit';
import AddVendor from './buildingSettings/vendors/addVendor/index';
import Members from './buildingSettings/members';
import Vendors from './buildingSettings/vendors';
import TaskSchedule from './buildingSection/budget-calendar/TaskSchedule';
import RFPSchedule from './buildingSection/budget-calendar/RFPSchedule';
import ViewPoDetail from './purchaseOrder/ViewPoDetail';

export default function Router(): JSX.Element {
  const location = useLocation();
  return (
    <div>
      {(!location.pathname.includes('email-vendor-to-schedule') && !location.pathname.includes('purchase-orders-list') && !location.pathname.includes('create-checklist-template') && !location.pathname.includes('rfp-form')) && <Navbar />}
      <Routes>
        <Route path='/workspaces' element={<WorkSpacesListing />} />
        <Route path='/workspace/create-new' element={<CreateWorkspace />} />
        <Route path='/settings/account' element={<AccountSettings />} />
        <Route path='/workspace/edit-purchase-order' element={<EditPurchaseOrder />} />
        <Route path='/workspace/new-purchase-order/:eventId' element={<NewPurchaseOrder />} />
        <Route path='/workspace/purchase-orders' element={<PurchaseOrders />} />
        <Route path='/workspace/rfps' element={<RFPModule />} />
        <Route path='/workspace/purchase-orders/:poId' element={<ViewPoDetail />} />
        <Route path='/workspace/budget-calendar' element={<BudgetCalendar />} />
        <Route path='/workspace/create-building' element={<NewBuilding />} />
        <Route path='/workspace/dashboard/:tabId' element={<BuildingDashboard />} />
        <Route path='/workspace/budget-calendar/event-schedule/:eventId/:eventType' element={<EventSchedule />} />
        <Route path='/workspace/budget-calendar/task-schedule/:taskId/:eventType' element={<TaskSchedule />} />
        <Route path='/workspace/budget-calendar/rfp-schedule/:eventId/:eventType' element={<RFPSchedule />} />
        <Route path='/email-vendor-to-schedule/:eventId' element={<VendorSchedule />} />
        <Route path='/workspace/unpaid-charges' element={<UnpaidCharges />} />
        <Route path='/workspace/settings/details' element={<Details />} />
        <Route path='/workspace/buildings/viewBuilding' element={<ViewBuilding />} />
        <Route path='/workspace/buildings/editBuilding' element={<EditBuilding />} />
        <Route path='/workspace/settings/vendor-contacts' element={<VendorContacts />} />
        <Route path='/workspace/settings/vendors' element={<Vendors />} />
        <Route path='/workspace/settings/vendors/:tempId' element={<AddVendor />} />
        <Route path='/workspace/settings/members' element={<Members />} />
        <Route path='/workspace/settings/charts-of-accounts' element={<ChartsOfAccounts />} />
        <Route path='/workspace/settings/vendorCOI' element={<VendorCOI />} />
        <Route path='/workspace/settings/cio/:cioId' element={<AddEditVendorCIO />} />
        <Route path='/workspace/settings/invoiceApproval' element={<InvoiceApproval />} />
        <Route path='/workspace/settings/invoice-approval' element={<InvoiceApproval />} />
        <Route path='/workspace/settings/po-approval' element={<POApproval />} />
        <Route path='/workspace/settings/unpaid-charges-email' element={<UnpaidChargesEmail />} />
        <Route path='/workspace/settings/unpaid-charges-email/:tempId' element={<AddEmailUnpaidChargesTemplate />} />
        <Route path='/workspace/settings/integrations' element={<Integrations />} />
        <Route path='/workspace/settings/coi-deficient-notifications' element={<COIDeficientNotification />} />
        <Route path='/workspace/settings/coi-deficient-notifications/:tempId' element={<COIDeficientNotificationAddTemplate />} />
        <Route path='/workspace/settings/tasks-templates' element={<TasksTemplates />} />
        <Route path='/workspace/settings/tasks-templates/:tempId' element={<TasksAddTemplates />} />
        <Route path='/workspace/settings/rfp-template' element={<RFP />} />
        <Route path='/rfp-form/:formcode' element={<RFPSchedulingForm />} />
        <Route path='/workspace/settings/rfp-template/:tempId' element={<AddOrEditRFP />} />
        <Route path='/workspace/settings/invoicing-document' element={<InvoicingDocument />} />
        <Route path='/workspace/settings/invoicing-document/:tempId' element={<InvoicingDocumentAddTemplate />} />
        <Route path='/workspace/cois' element={<COIs />} />
        <Route path='/workspace/cois/view-coi' element={<PdfViewerCOI />} />
        <Route path='/workspace/cois/:tempId' element={<AddCOIs />} />
        <Route path='/workspace/cois/errors' element={<COIsErrors />} />
        <Route path='/workspace/settings/checklist-templates' element={<ChecklistTemplates />} />
        <Route path='/workspace/settings/create-checklist-template/:templateId' element={<CreateChecklistTemplate />} />
        <Route path='/workspace/checklists' element={<Checklists />} />
        <Route path='/workspace/view-checklist/:checklistId' element={<ViewChecklist />} />
        <Route path='/purchase-orders-list/:sign/:id' element={<PurchaseOrderApproval />} />
        <Route path='/purchase-orders-list/:sign/:id' element={<PurchaseOrderApproval />} />
        <Route path='/workspace/settings/templates' element={<Template />} />
        <Route path='/workspace/settings/annual-budgets' element={<AnnualBudgets />} />
        <Route path='/workspace/settings/buildings' element={<Buildings />} />
        <Route path='/workspace/buildings' element={<Buildings />} />
        <Route path='*' element={<Navigate to='/workspaces' replace />} />
      </Routes>
    </div>
  );
}
