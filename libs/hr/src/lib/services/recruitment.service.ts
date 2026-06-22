import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  JobPostingDto,
  CreateJobPostingDto,
  UpdateJobPostingDto,
  ApplicationDto,
  ApplicationListDto,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
  ApplicationScoreDto,
  InterviewDto,
  CreateInterviewDto,
  OfferLetterDto,
  CreateOfferLetterDto,
  OfferResponseDto,
  QueryDto,
  CreateQueryDto,
  ApplicantTrackingDto,
  RecruitmentStatsDto,
  PublicRecruitmentStatsDto,
  PublicJobListingDto,
  IctOnboardingDto,
  MicrosoftAccountProvisioningDto,
} from '../dtos/recruitment.dto';

@Injectable({
  providedIn: 'root',
})
export class RecruitmentService {
  private readonly baseUrl = `${environment.apiUrl}/v1/recruitment`;

  constructor(private http: HttpClient) {}

  // ==================== Job Postings ====================

  getJobPostings(onlyActive = false): Observable<{ data: JobPostingDto[]; message: string }> {
    return this.http.get<{ data: JobPostingDto[]; message: string }>(`${this.baseUrl}/job-postings`, {
      params: { onlyActive: onlyActive.toString() },
      withCredentials: false,
    });
  }

  getJobPosting(id: string): Observable<{ data: JobPostingDto; message: string }> {
    return this.http.get<{ data: JobPostingDto; message: string }>(`${this.baseUrl}/job-postings/${id}`, {
      withCredentials: false,
    });
  }

  createJobPosting(dto: CreateJobPostingDto): Observable<{ data: JobPostingDto; message: string }> {
    return this.http.post<{ data: JobPostingDto; message: string }>(`${this.baseUrl}/job-postings`, dto);
  }

  updateJobPosting(id: string, dto: UpdateJobPostingDto): Observable<{ data: JobPostingDto; message: string }> {
    return this.http.patch<{ data: JobPostingDto; message: string }>(`${this.baseUrl}/job-postings/${id}`, dto);
  }

  deleteJobPosting(id: string): Observable<{ data: string; message: string }> {
    return this.http.delete<{ data: string; message: string }>(`${this.baseUrl}/job-postings/${id}`);
  }

  // ==================== Applications ====================

  applyForJob(jobId: string, dto: CreateApplicationDto, resume?: File, otherDocuments?: File[]): Observable<{ data: any; message: string }> {
    const formData = new FormData();
    formData.append('applicantName', dto.applicantName);
    formData.append('email', dto.email);
    if (dto.phone) formData.append('phone', dto.phone);
    if (dto.coverLetter) formData.append('coverLetter', dto.coverLetter);
    if (resume) formData.append('resume', resume, resume.name);
    if (otherDocuments) {
      otherDocuments.forEach((doc) => formData.append('otherDocuments', doc, doc.name));
    }
    return this.http.post<{ data: any; message: string }>(`${this.baseUrl}/public/apply/${jobId}`, formData, {
      withCredentials: false,
    });
  }

  trackApplication(applicationId: string, email: string): Observable<{ data: ApplicantTrackingDto; message: string }> {
    const params = new HttpParams().set('email', email);
    return this.http.get<{ data: ApplicantTrackingDto; message: string }>(
      `${this.baseUrl}/public/applications/${applicationId}/track`,
      { params, withCredentials: false }
    );
  }

  getApplications(
    page = 1,
    pageSize = 20,
    statusFilter?: string,
    search?: string
  ): Observable<{ data: ApplicationListDto; message: string }> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());
    if (statusFilter) params = params.set('statusFilter', statusFilter);
    if (search) params = params.set('search', search);
    return this.http.get<{ data: ApplicationListDto; message: string }>(`${this.baseUrl}/applications`, { params });
  }

  getApplication(id: string): Observable<{ data: ApplicationDto; message: string }> {
    return this.http.get<{ data: ApplicationDto; message: string }>(`${this.baseUrl}/applications/${id}`);
  }

  updateApplicationStatus(id: string, dto: UpdateApplicationStatusDto): Observable<{ data: any; message: string }> {
    return this.http.patch<{ data: any; message: string }>(`${this.baseUrl}/applications/${id}/status`, dto);
  }

  // ==================== AI Resume Scanning ====================

  scanResume(id: string): Observable<{ data: ApplicationScoreDto; message: string }> {
    return this.http.post<{ data: ApplicationScoreDto; message: string }>(`${this.baseUrl}/applications/${id}/scan-resume`, {});
  }

  getApplicationScore(id: string): Observable<{ data: ApplicationScoreDto; message: string }> {
    return this.http.get<{ data: ApplicationScoreDto; message: string }>(`${this.baseUrl}/applications/${id}/score`);
  }

  // ==================== Interviews ====================

  createInterview(id: string, dto: CreateInterviewDto): Observable<{ data: InterviewDto; message: string }> {
    return this.http.post<{ data: InterviewDto; message: string }>(`${this.baseUrl}/applications/${id}/interview`, dto);
  }

  getInterviews(id: string): Observable<{ data: InterviewDto[]; message: string }> {
    return this.http.get<{ data: InterviewDto[]; message: string }>(`${this.baseUrl}/applications/${id}/interviews`);
  }

  updateInterviewStatus(id: string, status: string, notes?: string): Observable<{ data: InterviewDto; message: string }> {
    return this.http.patch<{ data: InterviewDto; message: string }>(`${this.baseUrl}/interviews/${id}/status`, { status, notes });
  }

  // ==================== Offer Letters ====================

  createOfferLetter(id: string, dto: CreateOfferLetterDto): Observable<{ data: OfferLetterDto; message: string }> {
    return this.http.post<{ data: OfferLetterDto; message: string }>(`${this.baseUrl}/applications/${id}/offer-letter`, dto);
  }

  getOfferLetter(id: string): Observable<{ data: OfferLetterDto; message: string }> {
    return this.http.get<{ data: OfferLetterDto; message: string }>(`${this.baseUrl}/applications/${id}/offer-letter`);
  }

  updateOfferStatus(id: string, status: string): Observable<{ data: OfferLetterDto; message: string }> {
    return this.http.patch<{ data: OfferLetterDto; message: string }>(`${this.baseUrl}/offers/${id}/status`, { status });
  }

  respondToOffer(id: string, dto: OfferResponseDto): Observable<{ data: OfferLetterDto; message: string }> {
    return this.http.patch<{ data: OfferLetterDto; message: string }>(`${this.baseUrl}/offers/${id}/respond`, dto);
  }

  // ==================== Queries ====================

  createQuery(id: string, dto: CreateQueryDto): Observable<{ data: QueryDto; message: string }> {
    return this.http.post<{ data: QueryDto; message: string }>(`${this.baseUrl}/applications/${id}/query`, dto);
  }

  getQueries(id: string): Observable<{ data: QueryDto[]; message: string }> {
    return this.http.get<{ data: QueryDto[]; message: string }>(`${this.baseUrl}/applications/${id}/queries`);
  }

  // ==================== Stats ====================

  getIctOnboardingQueue(): Observable<{ data: IctOnboardingDto[]; message: string }> {
    return this.http.get<{ data: IctOnboardingDto[]; message: string }>(`${this.baseUrl}/ict-onboarding`);
  }

  provisionMicrosoftAccount(applicationId: string): Observable<{ data: MicrosoftAccountProvisioningDto; message: string }> {
    return this.http.post<{ data: MicrosoftAccountProvisioningDto; message: string }>(
      `${this.baseUrl}/applications/${applicationId}/ict-onboarding/microsoft-account`,
      {},
    );
  }

  getStats(): Observable<{ data: RecruitmentStatsDto; message: string }> {
    return this.http.get<{ data: RecruitmentStatsDto; message: string }>(`${this.baseUrl}/stats`);
  }

  getPublicStats(): Observable<{ data: PublicRecruitmentStatsDto; message: string }> {
    return this.http.get<{ data: PublicRecruitmentStatsDto; message: string }>(`${this.baseUrl}/public/stats`, {
      withCredentials: false,
    });
  }

  getPublicJobPostings(): Observable<{ data: PublicJobListingDto[]; message: string }> {
    return this.http.get<{ data: PublicJobListingDto[]; message: string }>(`${this.baseUrl}/job-postings`, {
      params: { onlyActive: 'true' },
      withCredentials: false,
    });
  }
}
