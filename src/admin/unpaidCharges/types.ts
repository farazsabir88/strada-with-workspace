export interface ItenantData {
  tenant_code: string;
  Status: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string | null;
  Rent: string;
  UnitCode: string;
  UnitRent: string;
  UnitSqFt: string;
  UnitEconomicStatus: string;
  LeaseFromDate: string;
  LeaseToDate: string;
  MoveInDate: string;
  MoveOutDate: string | null;
  NoticeDate: string | null;
  PossessionDate: string | null;
}
interface Itransactions {
  Identification: string | null;
  TransID: string;
  TransType: string;
  TransDate: string;
  ChargeCode: string;
  ChargeAmount: string;
  isOpen: string;
  isPosted: string;
  Description: string;
  Notes: string;
}
export interface Iresponse {
  tenant_data: ItenantData;
  transactions: [
    Itransactions,
    {
      Identification: string | null;
      TransID: string;
      TransType: string;
      TransDate: string;
      ChargeCode: string;
      ChargeAmount: string;
      isOpen: string;
      isPosted: string;
      Description: string;
      Notes: string;
    },
  ];
}
