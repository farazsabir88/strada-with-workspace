import type { ISingleContact } from 'admin/AdminFormTypes';

export interface IContactAction {
  type: string;
  data?: ISingleContact;
}

export interface IDeleteAction {
  open: boolean;
  id?: number | string;
}

export interface IDetailAction {
  open: boolean;
  data: ISingleContact | undefined;
}
