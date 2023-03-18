import type { IEventVendor } from 'admin/buildingSection/budget-calendar/types';

export interface RFPListing {
  budget: number | null;
  created_at: string;
  event: number;
  event_name: string;
  footer_text: string;
  form_name: string;
  header_text: string;
  id: number | string;
  updated_at: string;
}

export interface RFPActivityListing {
  activity: string;
  date: string;
  vendor: string;
}

interface IProposalAnswers {
  answer?: string;
  id: number;
  question?: string;
  rfp_question?: number;
  created_at?: string;
  file?: string;
  filename?: string;
}

interface IProposalQuestion {
  id: number;
  question: string;
}

export interface RFPProposal {
  contact_name: string;
  contacts: string;
  created_at: string;
  email: string;
  id: number | string;
  phone: string;
  proposal_answers: IProposalAnswers[];
  total_amount: number;
  vendor: IEventVendor | string | null;
}

export interface RFPProposalQuestion {
  field_type: string;
  id: number;
  label: string;
  survey_questions: IProposalQuestion[];
}
