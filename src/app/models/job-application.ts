export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: Date;
  interviewDate?: Date;
  deadline?: Date;
  notes?: string;
}