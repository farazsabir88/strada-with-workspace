import type { IVendorScheduleDetails } from 'admin/buildingSection/budget-calendar/VendorSchedule/types';
import type { RFPListing, RFPProposal } from 'admin/RFP/types';
import type { IRFPTemplate } from 'admin/buildingSettings/RFPForm/types';
import type { IVendorData } from 'admin/buildingSettings/vendors/types';
import type { IMemberData } from 'admin/buildingSettings/members/types';
import type { IWorkspaceVendorCOI } from 'admin/buildingSettings/vendorCOI/types';
import type { IWorkspaceCOA } from 'admin/buildingSettings/chartsOfAccounts/types';
import type {
  IForgetPassword,
  IResetPassword,
  ILogin,
  IRequestDemo,
  ISignup,
  IContactUs,
} from './client/ClientFormTypes';
import type { IPayload } from './client/accountInvite/types';
import type {
  IEventSchedulePayload, IEventScheduleModule,
  IeditCOIs, ISingleUnpaidCharge, IDetailForm, IChartsOfAccountsForm, IUpdatePasswordForm, IUpdateEmailForm, IUpdateNameForm, IAddInvoiceForm, ISingleContact, ITableColumn, ISinglAccount, IContactDialog, ISingleVendorCIO, IYardiCredentials, ISaveYardiPayload, IunpaidEmailCharges, IPurchaseOrder,
  ITasksInputs, IinvoiceDocument,
} from './admin/AdminFormTypes';
import type { IEvent } from './admin/buildingSection/budget-calendar/types';

export interface IdefaultValues {
  email: string;
  first_name: string;
}

export interface DynamicType {
  id: string;
}

export interface IFormValues extends IForgetPassword, IResetPassword, ILogin, IRequestDemo, ISignup, IContactUs, IDetailForm, IChartsOfAccountsForm, IUpdatePasswordForm,
  IUpdateEmailForm, IUpdateNameForm, IAddInvoiceForm, IContactDialog, ISingleVendorCIO, IYardiCredentials, ISaveYardiPayload, IunpaidEmailCharges,
  IinvoiceDocument, ITasksInputs, IeditCOIs, IPurchaseOrder, IVendorScheduleDetails, IEventSchedulePayload, IEventScheduleModule, IRFPTemplate, IPayload, IVendorData {
  [key: number | string]: number | string | null | undefined;
  age: string;
  // subject: string | null;
  // context: string;
  // to: string;
  // cc: string;
  // bcc: string;
  // body: string;
  // future_days: number | string;
  // empty_data: string;
  // // total_amount: string;
  // company_name: string;
  // contact_name: string;
}

// Table Types

export interface IDataObject
  extends ISingleContact,
  ISinglAccount,
  ISingleVendorCIO, IEvent, IeditCOIs, ISingleUnpaidCharge, RFPListing, RFPProposal, IMemberData, IWorkspaceVendorCOI, IWorkspaceCOA {total_tasks: number; template: number;isPrint: boolean; contact_first_name: string; contact_last_name: string}
export interface IDataColumn extends ITableColumn {
  test: string;
}

export interface ITableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: ITableColumn[];
  selection?: boolean;
}
