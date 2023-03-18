export interface ICurrentBuilding {
  address: string;
  city: string;
  company: string;
  contact_email: string;
  contact_first_name: string;
  contact_last_name: string;
  country: string;
  id: number;
  no_approval: number;
  property_manager: IPropertyManager[];
  share_settings: boolean;
  shared_buildings: string[];
  state: string;
  yardi_code: string;
  yardi_transactions: boolean;
  zip: string;
}

export interface IPropertyManager {
  role: number;
  user: IBuildingUser;
}

export interface IBuildingUser {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  is_assigned_notification: boolean;
  is_collaborator_notification: boolean;
  is_mentioned_notification: boolean;
  last_name: string;
  title: string;
}
