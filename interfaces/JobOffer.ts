export interface JobOffer {
  recruiterFirstName: string;
  recruiterLastName: string;
  title: string;
  company: string;
  location: string;
  jobType: 'REMOTO' | 'HIBRIDO';
  jobTime: 'FULL TIME' | 'PART TIME';
  about: string;
}
