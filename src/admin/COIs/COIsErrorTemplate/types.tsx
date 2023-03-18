export interface Ierror {
  cois_id: 12;
  insured: string;
  sent_notes: boolean;
  insured_email: string;
  coi_file_name: string;
  errors: [
    {
      error_text: string;
    },
  ];
}

export interface Ipayload {
  results: Ierror[];
  total_count: number;
}
