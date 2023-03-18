export interface IEmilForwardingIProps {
  open: boolean;
  handleClose: () => void;
  setIsForwardingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IPasswordPayloadProps {
  user_id: number | string;
  password: string;
  repeat_password: string;
  old_password: string;
}

export interface IGooglePayloadProps {
  email: string;
  name: string;
  accountIdentifier: string;
  environment: string;
  homeAccountIdentifier: number | string;
  userId: number;
  expiresOn: Date;
  oauth_token: string;
}
export interface DefaultIntegrationResponse {
  success: true;
  results: '';
  message: string;
}
