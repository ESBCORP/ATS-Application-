import { Job } from '../types';

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: string | null;
  modifiedAt?: string;
}

export interface Job {
  id: string;
  title: string;
  status: 'Active' | 'Inactive' | 'Closed' | 'Draft';
  payRate: number;
  createdDate: string;
  createdBy: string;
  modifiedDate?: string;
  modifiedBy?: string;
  endClient: string;
  recruiters: string[];
  city: string;
  state: string;
  country: string;
  customer: string;
  accountManager: string;
  customerType: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  workType: 'Remote' | 'Onsite' | 'Hybrid';
  experienceLevel: 'Junior' | 'Mid' | 'Senior';
  positions: number;
  primarySkills: string[];
  secondarySkills: string[];
  languages: string[];
  qualifications: string[];
  industry?: string;
  priority?: string;
  projectName?: string;
  projectId?: string;
  clientJobId?: string;
  placementType: string;
  clientPayType: string;
  clientContractPeriod?: string;
  jobType: string;
  payType: string;
  billRate?: number;
  contractPeriod?: string;
  isPreferred: boolean;
  jobDomain?: string;
  description: string;
  summary: string;
  qaItems?: QAItem[];
  titleBoolean?: string;
  skillBoolean?: string;
  residencyStatus?: 'Resident' | 'Immigrant';
  adjustedPayRate?: number;
  custom_fields?: Record<
  string,
  {
    field_label: string;
    field_type: string;
    value: string | null;
    default_value?: string;
    [key: string]: any;
  }
> | null;
}


export interface Resume {
  id: string;
  fileName: string;
  uploadDate: string;
  isPrimary: boolean;
  url: string;
}

export interface Document {
  id: string;
  fileName: string;
  uploadDate: string;
  type: string;
  url: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  modifiedAt?: string;
  modifiedBy?: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  alternateEmail?: string;
  phone: string;
  linkedinUrl: string;
  status: 'Active' | 'Inactive';
  owner: string;
  jobTitle: string;
  workAuthorization: string;
  yearsOfExperience: number;
  city: string;
  state: string;
  country: string;
  address: string;
  skills: string[];
  softSkills: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    github?: string;
  };
  willingToRelocate: boolean;
  employmentType: string[];
  expectedRateType: 'Hourly' | 'Monthly' | 'Annual';
  remoteStatus: 'Remote' | 'Onsite' | 'Hybrid';
  languagesKnown: string[];
  resumes: Resume[];
  documents: Document[];
  rtrStatus: 'Received' | 'Not Received';
  notes: Note[];
  custom_fields?: {
  [key: string]: {
    field_id: number;
    field_label: string;
    field_type: string;
    value: string | number | null;
    is_required: boolean;
    field_options: string;
    placeholder: string;
    help_text: string;
    default_value: string;
  };
};
}

export interface Pipeline {
  id: string;
  candidateName: string;
  jobId: string;
  stage: 'Screening' | 'Submitted' | 'Interview' | 'Offer' | 'Hired';
  lastUpdated: string;
  status: 'Active' | 'Inactive';
}

export interface Submission {
  id: string;
  candidateId: string;
  firstName: string;
  lastName: string;
  jobId: string;
  jobTitle: string;
  client: string;
  status: 'Submitted' | 'Rejected' | 'Offered';
  payType: string;
  expectedPay: number;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  jobHiringType: string;
  submitter: string;
  submittedDate: string;
  rejectionReason?: string;
  rejectionComments?: string;
  availability?: string;
  engagement?: string;
  locationPreference?: string;
  billType?: string;
  billRate?: number;
  payRate?: number;
  email?: string;
  phone?: string;
  workAuthorization?: string;
  linkedinUrl?: string;
  customFields?: {
    [key: string]: {
      field_id: number;
      field_label: string;
      field_type: string;
      value: string | number | null;
      is_required: boolean;
      field_options: string;
      placeholder: string;
      help_text: string;
      default_value: string | number | null;
    };
  };
}

export interface CustomField {
  field_id: number;
  field_label: string;
  field_type: string;
  value: any;
  is_required: boolean;
  field_options: string;
  placeholder: string;
  help_text: string;
  default_value: string;
}

export interface CustomFields {
  [key: string]: CustomField;
}

// export interface User {
//   id: string;
//   username: string;
//   name: string;
//   email: string;
//   phone: string;
//   avatar: string;
//   role: 'SuperAdmin' | 'Admin' | 'Employee';
//   status: 'Active' | 'Inactive';
// }

export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  avatar: string;
  role_id:number;
  role_name: 'SuperAdmin' | 'Admin' | 'Employee'| string;
  status: 'Active' | 'Inactive';
  company: string;
  department: string;
  location: string;
  bio: string;
}


export interface Message {
  id: string;
  candidateId: string;
  content: string;
  timestamp: string;
  isAI: boolean;
  isIncoming: boolean;
}

export interface Call {
  id: string;
  candidateId: string;
  duration: number;
  timestamp: string;
  type: 'incoming' | 'outgoing';
  status: 'completed' | 'missed' | 'ongoing';
}

export interface Meeting {
  id: string;
  candidateId: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  recordingUrl?: string;
  jobId?: string;
}

export interface Recording {
  id: string;
  candidateId: string;
  timestamp: string;
  duration: number;
  url: string;
}

export interface PhoneCall {
  id: string;
  candidateId: string;
  candidateName: string;
  timestamp: string;
  duration: number;
  notes: string;
  status: 'completed' | 'missed' | 'cancelled';
}