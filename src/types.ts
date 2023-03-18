import type { ReactNode } from 'react';
import type React from 'react';
import type { Control, FieldPath, FieldErrors } from 'react-hook-form';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { IFormValues } from 'formsTypes';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type IObjectKeys = Record<string, boolean | number | string | null>;

export interface Iuser extends IObjectKeys {
  avatar: string;
  default_integration: string;
  email: string;
  first_name: string;
  forwarding_mail: string | null;
  id: number | string;
  is_assigned_notification: boolean;
  is_collaborator_notification: boolean;
  is_mentioned_notification: boolean;
  last_name: string;
  manager_approval_settings: number | string | null;
  role: string;
  sender_email: string | null;
  title: string;
  token: string;
}

export interface ICustomCheckbox {
  name: FieldPath<IFormValues>;
  label?: string;
  checked?: boolean | undefined;
  onChange?: (e: React.ChangeEvent) => void;
  value?: boolean | undefined;
}
export interface IHookCheckbox extends ICustomCheckbox {
  control: Control<IFormValues>;
}
export interface ICustomRadioButton {
  name?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent, value: string) => void;
  value?: number | string;
}
export interface ISwitch {
  name?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent, val: boolean) => void;
  onClick?: () => void;
  checked?: boolean;
  value?: boolean;
}

export interface SelectOption {
  name: string;
  value: number | string;
  avatar?: string;
}

export interface ISelectInput {
  name: string;
  label: string;
  options: SelectOption[];
  onChange?: (e: SelectChangeEvent) => void;
  error?: boolean;
  className?: string;
  id?: string;
  helperText?: string;
  value?: string | undefined;
  defaultValue?: string | undefined;
  showPleaseSelect?: boolean;
  disabled?: boolean;
  haveMarginBottom?: boolean;
  showPlaceholder?: boolean;
}
export interface ISelectSearchInputOption {
  name: string;
  id: number | string;
  avatar: string | null;
}
export interface Imember {
  name: string;
  id: number | string;
  avatar: string | null;
}
export interface ISelectSearchInput {
  name: string;
  label: string;
  options: Imember[];
  onChange?: (e: React.SyntheticEvent, value: Imember | null) => void;
  value: Imember | null;
}

export interface IHookSelectField extends ISelectInput {
  control: Control<IFormValues>;
  errors: FieldErrors;
  name: FieldPath<IFormValues>;
}

export interface IInputField {
  name?: string;
  variant?: string | undefined;
  helperText?: string | undefined;
  fullWidth?: boolean;
  error?: boolean;
  className?: string;
  id: number | string;
  label?: string;
  type?: number | string;
  onChange?: () => void;
  onBlur?: () => void;
}
export interface IInputFieldStyle extends IInputField {
  endAdornment: () => JSX.Element;
  error: boolean;
}

export interface ICertificateHolder {
  name: string;
  type: string;
}

export interface TextFieldTypes {
  id?: number | string;
  name?: FieldPath<IFormValues>;
  label?: string;
  type?: string;
  required?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  control?: Control<IFormValues>;
  errors?: FieldErrors<IFormValues>;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  multiline?: boolean;
  rows?: number;
  className?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  value?: ICertificateHolder[] | string[] | boolean | number | string | null;
  variant?: 'filled' | 'outlined' | 'standard';
  date?: boolean;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  InputLabelProps?: any;
}

export interface IBuildingUser {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  role: number;
}

export interface Ibuilding {
  address: string;
  city: string;
  company: string;
  contact_email: string;
  contact_first_name: string;
  contact_last_name: string;
  country: string;
  id: number;
  no_approval: number;
  role: number;
  state: number;
  tenants?: string[];
  users: IBuildingUser[];
  yardi_code: string | null;
  yardi_connected: boolean;
  zip: string;
  property_manager: [];
}
export interface IMember {
  id: number;
  name: string;
  avatar: string;
}
export interface Iworkspace {
  created_at: string;
  id: number;
  logo_url: string | null;
  members: IMember[];
  members_count: number;
  name: string;
  recently_accessed: string;
  updated_at: string;
  user: number;
}
