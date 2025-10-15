export interface JobOffer {
  recruiterFirstName: string;
  recruiterLastName: string;
  recruiterPhoto?: string;
  recruiterProfession: string;
  recruiterLocation: string;
  title: string;
  company: string;
  location: string;
  jobType: 'REMOTO' | 'HIBRIDO';
  jobTime: 'FULL TIME' | 'PART TIME';
  about: string;
  skills?: string[];
  cuentaRegresiva?: string;
}
