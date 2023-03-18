export interface Imanagers {

  email: string;
  firstName: string;
  lastName: string;
  token: string | null;

}
export interface IeditThresholdApprover {
  id: number;
  threshold: number;
  managers: [ {
    email: string;
    firstName: string;
    lastName: string;
    token: string | null;

  }];
  is_default: boolean;
}
