export interface IForgetPassword {
  [key: number | string]: number | string | null | undefined;
  email: string;
}

export interface IResetPassword {
  [key: number | string]: number | string | null | undefined;
  password: string;
  repeat_password: string;
  reset_key: string | undefined;
}

export interface ILogin {
  [key: number | string]: number | string | null | undefined;
  username: string;
  password: string;
}
export interface IRequestDemo {
  [key: number | string]: number | string | null | undefined;
  first_name: string;
  email: string;
}
export interface ISignup {
  [key: number | string]: number | string | null | undefined;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  repeat_password: string;
}
export interface IContactUs {
  [key: number | string]: number | string | null | undefined;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: number | string;
  company: number | string;
  message: string;
  isAggreed: boolean;
}
