export interface JobPostingDto {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  employmentType: string;
  status: string;
  departmentId: string | null;
  departmentName: string | null;
  createdBy: string;
  createdByName: string | null;
  deadline: Date;
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobPostingDto {
  title: string;
  description: string;
  requirements: string;
  location: string;
  employmentType: string;
  departmentId: string | null;
  deadline?: Date;
}

export interface UpdateJobPostingDto {
  title?: string;
  description?: string;
  requirements?: string;
  location?: string;
  employmentType?: string;
  status?: string;
  departmentId?: string | null;
  deadline?: Date | null;
}

export interface CreateApplicationDto {
  applicantName: string;
  email: string;
  phone?: string;
  coverLetter?: string;
}

export interface ApplicationDto {
  id: string;
  jobPostingId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string | null;
  resumeFilePath: string | null;
  coverLetter: string | null;
  status: string;
  assignedTo: string | null;
  assignedToName: string | null;
  createdAt: Date;
  updatedAt: Date;
  overallMatch: number | null;
  scoredAt: Date | null;
}

export interface ApplicationListDto {
  applications: ApplicationDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface UpdateApplicationStatusDto {
  status: string;
  assignedTo?: string | null;
}

export interface ApplicationScoreDto {
  id: string;
  applicationId: string;
  technicalMatch: number;
  culturalFit: number;
  educationMatch: number;
  experienceMatch: number;
  overallMatch: number;
  scannedResumeText: string | null;
  aiAnalysisNotes: string | null;
  scannedAt: Date | null;
}

export interface CreateInterviewerDto {
  employeeId?: string;
  email: string;
  name?: string;
}

export interface InterviewerDto {
  id: string;
  employeeId: string | null;
  employeeName: string | null;
  email: string;
  name: string | null;
}

export interface InterviewDto {
  id: string;
  applicationId: string;
  applicantName: string;
  type: string;
  scheduledFor: Date;
  meetingLink: string | null;
  teamsMeetingId: string | null;
  status: string;
  notes: string | null;
  createdAt: Date;
  interviewers?: InterviewerDto[];
}

export interface CreateInterviewDto {
  type: string;
  scheduledFor: Date;
  notes?: string;
  interviewers?: CreateInterviewerDto[];
}

export interface OfferLetterDto {
  id: string;
  applicationId: string;
  applicantName: string;
  companyName: string;
  position: string;
  salary: number;
  startDate: Date | null;
  benefits: string;
  content: string;
  status: string;
  sentAt: Date | null;
  expiresAt: Date | null;
  signedAt: Date | null;
  createdAt: Date;
}

export interface CreateOfferLetterDto {
  companyName: string;
  position: string;
  salary: string;
  startDate: Date;
  benefits: string;
  content: string;
  expiresAt: Date;
}

export interface OfferResponseDto {
  response: string;
  comments?: string;
}

export interface QueryDto {
  id: string;
  applicationId: string;
  message: string;
  messageFrom: string;
  fromUserName: string | null;
  createdAt: Date;
}

export interface CreateQueryDto {
  message: string;
}

export interface ApplicantTrackingDto {
  application: ApplicationDto;
  interviews: InterviewDto[];
  offerLetter: OfferLetterDto | null;
  queries: QueryDto[];
}

export interface RecruitmentStatsDto {
  totalJobPostings: number;
  activeJobPostings: number;
  totalApplications: number;
  statusBreakdown: Record<string, number>;
  shortlistedCount: number;
  interviewCount: number;
  offerCount: number;
  hiredCount: number;
  rejectedCount: number;
  averageMatchScore: number;
}

export interface PublicRecruitmentStatsDto {
  openPositions: number;
  totalApplications: number;
  featuredJobs: PublicJobListingDto[];
  companyName: string;
}

export interface PublicJobListingDto {
  id: string;
  title: string;
  location: string | null;
  employmentType: string;
  departmentName: string | null;
  deadline: Date;
  applicationsCount: number;
}
