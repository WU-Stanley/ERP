import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecruitmentService } from '../../../services/recruitment.service';
import { ApplicationDto, ApplicationScoreDto, InterviewDto, CreateInterviewDto, OfferLetterDto, CreateOfferLetterDto, QueryDto, CreateQueryDto } from '../../../dtos/recruitment.dto';
import { AlertService, CustomSelectComponent } from '@erp/core';
import { environment } from '@env/environment';
import { AuthService } from '@erp/auth';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RichTextEditorComponent } from '@erp/hr';

type ActiveTab = 'overview' | 'score' | 'interviews' | 'offers' | 'messages';

@Component({
  selector: 'app-recruitment-application-detail',
  templateUrl: './recruitment-application-detail.component.html',
  styleUrls: ['./recruitment-application-detail.component.css'],
  imports: [CommonModule, RouterModule, FormsModule, CustomSelectComponent, RichTextEditorComponent],
})
export class RecruitmentApplicationDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recruitmentService = inject(RecruitmentService);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);
  private readonly sanitizer = inject(DomSanitizer);

  applicationId = '';
  showResumePreview = false;
  isScanning = false;
  isScheduling = false;
  isCreatingOffer = false;
  isConfirmingResumption = false;
  application: ApplicationDto | null = null;
  score: ApplicationScoreDto | null = null;
  interviews: InterviewDto[] = [];
  offerLetters: OfferLetterDto[] = [];
  queries: QueryDto[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  activeTab: ActiveTab = 'overview';
  statusTabs: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: 'description' },
    { key: 'score', label: 'AI Score', icon: 'smart_toy' },
    { key: 'interviews', label: 'Interviews', icon: 'videocam' },
    { key: 'offers', label: 'Offer Letters', icon: 'send' },
    { key: 'messages', label: 'Messages', icon: 'message' },
  ];

  // Status update form
  statusUpdateForm = { status: '', assignedTo: '' };

  // Interview creation form
  showNewInterview = false;
  interviewForm = this.createInterviewForm();
  staff: any[] = [];
  selectedInterviewers: { employeeId?: string; email: string; name?: string }[] = [];
  externalInterviewer = { name: '', email: '' };
  selectedStaffId = '';
  selectedStaffIds: string[] = [];

  private createInterviewForm() {
    return {
      type: 'Phone Screen',
      scheduledFor: '',
      notes: '',
    };
  }

  // Offer letter creation form
  showNewOffer = false;
  offerForm = this.createOfferForm();
  private createOfferForm() {
    return {
      companyName: '',
      position: '',
      salary: '',
      startDate: '',
      benefits: '',
      content: '',
      expiresAt: '',
      gradeLevel: '',
      attachment: null as File | null
    };
  }

  // Query form
  queryText = '';

  selectedTemplate = '';
  showPreview = false;
  showSendConfirm = false;

  private readonly offerTemplates: Record<string, string> = {
    academic: `<h2>Offer of Employment - Academic Staff</h2>
<p>Dear {{applicantName}},</p>
<p>We are pleased to offer you the position of <strong>{{position}}</strong> at <strong>{{companyName}}</strong>. This is a full-time academic appointment.</p>
<h3>Position Details</h3>
<ul>
<li><strong>Position Title:</strong> {{position}}</li>
<li><strong>Start Date:</strong> {{startDate}}</li>
</ul>
<h3>Compensation &amp; Benefits</h3>
<p>The annual salary is <strong>₦{{salary}}</strong>. Additional benefits include: {{benefits}}.</p>
<h3>Terms</h3>
<p>Please confirm your acceptance by signing and returning a copy of this letter. We look forward to welcoming you.</p>
<p>Best regards,<br/><strong>Human Resources</strong><br/>{{companyName}}</p>`,
    administrative: `<h2>Offer of Employment - Administrative Staff</h2>
<p>Dear {{applicantName}},</p>
<p>We are pleased to extend an offer for the position of <strong>{{position}}</strong> at <strong>{{companyName}}</strong>.</p>
<h3>Role Overview</h3>
<p>You will be responsible for supporting the day-to-day administrative operations of the department. This is a full-time role with a competitive compensation package.</p>
<h3>Key Terms</h3>
<ul>
<li><strong>Position:</strong> {{position}}</li>
<li><strong>Start Date:</strong> {{startDate}}</li>
<li><strong>Salary:</strong> ₦{{salary}} per annum</li>
</ul>
<h3>Benefits</h3>
<p>{{benefits}}</p>
<p>Please review, sign, and return this offer letter to confirm your acceptance.</p>
<p>Best regards,<br/><strong>Human Resources</strong><br/>{{companyName}}</p>`,
    parttime: `<h2>Offer of Engagement - Part-Time Staff</h2>
<p>Dear {{applicantName}},</p>
<p>We are pleased to offer you a part-time engagement as <strong>{{position}}</strong> at <strong>{{companyName}}</strong>.</p>
<h3>Engagement Details</h3>
<ul>
<li><strong>Role:</strong> {{position}}</li>
<li><strong>Start Date:</strong> {{startDate}}</li>
<li><strong>Compensation:</strong> ₦{{salary}}</li>
</ul>
<h3>Additional Information</h3>
<p>{{benefits}}</p>
<p>Kindly confirm your acceptance by signing below.</p>
<p>Best regards,<br/><strong>Human Resources</strong><br/>{{companyName}}</p>`,
  };

  applyTemplate(): void {
    if (!this.selectedTemplate || !this.application) return;
    const template = this.offerTemplates[this.selectedTemplate];
    if (!template) return;
    const appName = this.application.applicantName || '[Applicant Name]';
    const position = this.offerForm.position || this.application.jobTitle || '[Position]';
    const company = this.offerForm.companyName || 'Wigwe University';
    const salary = this.offerForm.salary || '0';
    const startDate = this.offerForm.startDate
      ? new Date(this.offerForm.startDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
      : '[Start Date]';
    const benefits = this.offerForm.benefits || '[Benefits details]';

    this.offerForm.content = template
      .replace(/\{\{applicantName\}\}/g, appName)
      .replace(/\{\{position\}\}/g, position)
      .replace(/\{\{companyName\}\}/g, company)
      .replace(/\{\{salary\}\}/g, salary)
      .replace(/\{\{startDate\}\}/g, startDate)
      .replace(/\{\{benefits\}\}/g, benefits);
    this.selectedTemplate = '';
    this.autoSaveOffer();
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  autoSaveOffer(): void {
    if (!this.applicationId) return;
    sessionStorage.setItem(`offerForm_${this.applicationId}`, JSON.stringify(this.offerForm));
  }

  private restoreOfferDraft(): void {
    if (!this.applicationId) return;
    const saved = sessionStorage.getItem(`offerForm_${this.applicationId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.offerForm = { ...this.offerForm, ...parsed };
      } catch { /* ignore */ }
    }
  }

  promptSendOffer(offerId: string): void {
    this.pendingSendOfferId = offerId;
    this.showSendConfirm = true;
  }

  pendingSendOfferId: string | null = null;

  confirmSend(): void {
    if (!this.pendingSendOfferId) return;
    this.recruitmentService.updateOfferStatus(this.pendingSendOfferId, 'Sent').subscribe({
      next: () => {
        this.successMessage = 'Offer letter sent successfully.';
        this.showSendConfirm = false;
        this.pendingSendOfferId = null;
        this.loadAll();
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: () => {
        this.errorMessage = 'Unable to send offer.';
        this.showSendConfirm = false;
        this.pendingSendOfferId = null;
      },
    });
  }

  ngOnInit() {
    this.applicationId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.applicationId) {
      this.errorMessage = 'No application specified.';
      this.isLoading = false;
      return;
    }
    this.restoreOfferDraft();
    this.loadAll();
  }

  loadAll() {
    this.isLoading = true;
    this.errorMessage = '';

    // Parallel load all data
    Promise.all([
      this.loadApplication(),
      this.loadScore(),
      this.loadInterviews(),
      this.loadOfferLetters(),
      this.loadQueries(),
      this.loadStaff(),
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  loadStaff() {
    return this.authService.getAllStaff().subscribe({
      next: (res) => {
        this.staff = res.data ?? [];
      },
      error: () => {
        this.staff = [];
      },
    });
  }

  loadApplication() {
    return this.recruitmentService.getApplication(this.applicationId).subscribe({
      next: (res) => {
        this.application = res.data;
        if (this.application) {
          if (!this.offerForm.companyName) {
            this.offerForm.companyName = 'Wigwe University';
          }
          if (!this.offerForm.position) {
            this.offerForm.position = this.application.jobTitle;
          }
        }
      },
      error: () => {
        this.errorMessage = 'Unable to load application details.';
      },
    });
  }

  loadScore() {
    return this.recruitmentService.getApplicationScore(this.applicationId).subscribe({
      next: (res) => {
        this.score = res.data;
      },
      error: () => {
        // Score not available yet — that's fine
        this.score = null;
      },
    });
  }

  loadInterviews() {
    return this.recruitmentService.getInterviews(this.applicationId).subscribe({
      next: (res) => {
        this.interviews = res.data ?? [];
      },
      error: () => {
        this.interviews = [];
      },
    });
  }

  loadOfferLetters() {
    // Fetch offer letter if it exists
    return this.recruitmentService.getOfferLetter(this.applicationId).subscribe({
      next: (res) => {
        this.offerLetters = res.data ? [res.data] : [];
      },
      error: () => {
        this.offerLetters = [];
      },
    });
  }

  loadQueries() {
    return this.recruitmentService.getQueries(this.applicationId).subscribe({
      next: (res) => {
        this.queries = res.data ?? [];
      },
      error: () => {
        this.queries = [];
      },
    });
  }

  // ---- Status Update ----
  updateStatus() {
    if (!this.application || !this.statusUpdateForm.status) return;
    this.recruitmentService.updateApplicationStatus(this.applicationId, {
      status: this.statusUpdateForm.status,
      assignedTo: this.statusUpdateForm.assignedTo || null,
    }).subscribe({
      next: () => {
        this.successMessage = `Application status updated to "${this.statusUpdateForm.status}".`;
        this.errorMessage = '';
        this.loadAll();
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Unable to update status.';
        this.successMessage = '';
      },
    });
  }

  // ---- Rescan Resume ----
  rescanResume() {
    this.isScanning = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.recruitmentService.scanResume(this.applicationId).subscribe({
      next: (res) => {
        this.score = res.data;
        this.successMessage = 'Resume re-scanned successfully.';
        this.isScanning = false;
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Resume scan failed.';
        this.isScanning = false;
      },
    });
  }

  // ---- Create Interview ----
  createInterview() {
    if (this.interviewForm.scheduledFor && this.application) {
      this.isScheduling = true;
      const dto: CreateInterviewDto = {
        type: this.interviewForm.type,
        scheduledFor: new Date(this.interviewForm.scheduledFor),
        notes: this.interviewForm.notes,
        interviewers: this.selectedInterviewers.map(i => ({
          employeeId: i.employeeId,
          email: i.email,
          name: i.name
        }))
      };
      this.recruitmentService.createInterview(this.applicationId, dto).subscribe({
        next: () => {
          this.successMessage = 'Interview scheduled successfully.';
          this.showNewInterview = false;
          this.selectedInterviewers = [];
          this.selectedStaffIds = [];
          this.selectedStaffId = '';
          this.externalInterviewer = { name: '', email: '' };
          this.loadAll();
          this.isScheduling = false;
          setTimeout(() => (this.successMessage = ''), 4000);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Failed to schedule interview.';
          this.isScheduling = false;
        },
      });
    }
  }

  onStaffSelectionChange(selectedIds: string[]) {
    // Keep external interviewers (those whose email is not in staff list)
    const external = this.selectedInterviewers.filter(i => {
      if (!i.email) return true;
      const lowerEmail = i.email.toLowerCase();
      return !this.staff.some(s => s.email?.toLowerCase() === lowerEmail);
    });

    // Get selected staff members details
    const selectedStaff = this.staff
      .filter(s => selectedIds.includes(s.id))
      .map(s => ({
        employeeId: s.employeeId || undefined,
        email: s.email,
        name: s.fullName
      }));

    // Combine them
    this.selectedInterviewers = [...selectedStaff, ...external];
  }

  addExternalInterviewer() {
    const email = this.externalInterviewer.email.trim();
    const name = this.externalInterviewer.name.trim();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.alertService.showError('Please enter a valid email address.');
      return;
    }

    const exists = this.selectedInterviewers.some(i => i.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      this.selectedInterviewers.push({
        email: email,
        name: name || undefined
      });
    }
    this.externalInterviewer = { name: '', email: '' };
  }

  removeInterviewer(index: number) {
    const removed = this.selectedInterviewers[index];
    this.selectedInterviewers.splice(index, 1);

    // If it was a staff member, also remove their ID from selectedStaffIds
    if (removed && removed.email) {
      const lowerEmail = removed.email.toLowerCase();
      const staffMember = this.staff.find(s => s.email?.toLowerCase() === lowerEmail);
      if (staffMember) {
        this.selectedStaffIds = this.selectedStaffIds.filter(id => id !== staffMember.id);
      }
    }
  }

  updateInterviewStatus(interviewId: string, status: string) {
    this.recruitmentService.updateInterviewStatus(interviewId, status).subscribe({
      next: () => {
        this.loadInterviews();
      },
      error: () => {
        this.errorMessage = 'Unable to update interview status.';
      },
    });
  }

  // ---- Create Offer Letter ----
  onOfferAttachmentChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.offerForm.attachment = input.files[0];
    }
  }

  createOfferLetter() {
    if (!this.application) return;
    if (!this.offerForm.startDate || isNaN(new Date(this.offerForm.startDate).getTime())) {
      this.errorMessage = 'Please select a valid start date.';
      return;
    }
    if (!this.offerForm.expiresAt || isNaN(new Date(this.offerForm.expiresAt).getTime())) {
      this.errorMessage = 'Please select a valid expiration date.';
      return;
    }
    this.isCreatingOffer = true;
    const dto: CreateOfferLetterDto = {
      companyName: this.offerForm.companyName || 'Wigwe University',
      position: this.offerForm.position || this.application.jobTitle,
      salary: this.offerForm.salary || '0',
      startDate: new Date(this.offerForm.startDate),
      benefits: this.offerForm.benefits,
      content: this.offerForm.content,
      gradeLevel: this.offerForm.gradeLevel,
      attachment: this.offerForm.attachment || undefined,
      expiresAt: new Date(this.offerForm.expiresAt),
    };
    this.recruitmentService.createOfferLetter(this.applicationId, dto).subscribe({
      next: () => {
        this.successMessage = 'Offer letter created successfully.';
        this.showNewOffer = false;
        this.clearOfferDraft();
        this.loadAll();
        this.isCreatingOffer = false;
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to create offer letter.';
        this.isCreatingOffer = false;
      },
    });
  }

  confirmResumption() {
    if (!this.application) return;
    this.isConfirmingResumption = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.recruitmentService.confirmResumption(this.applicationId).subscribe({
      next: (res) => {
        this.successMessage = 'Resumption confirmed and ICT onboarding initiated.';
        this.loadAll();
        this.isConfirmingResumption = false;
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to confirm resumption.';
        this.isConfirmingResumption = false;
      }
    });
  }

  updateOfferStatus(status: string) {
    if (this.offerLetters.length === 0) return;
    if (status === 'Sent') {
      this.promptSendOffer(this.offerLetters[0].id);
      return;
    }
    this.recruitmentService.updateOfferStatus(this.offerLetters[0].id, status).subscribe({
      next: () => {
        this.loadAll();
      },
      error: () => {
        this.errorMessage = 'Unable to update offer status.';
      },
    });
  }

  clearOfferDraft(): void {
    if (!this.applicationId) return;
    sessionStorage.removeItem(`offerForm_${this.applicationId}`);
  }

  // ---- Send Query/Message ----
  sendQuery() {
    if (!this.queryText.trim()) return;
    const dto: CreateQueryDto = { message: this.queryText.trim() };
    this.recruitmentService.createQuery(this.applicationId, dto).subscribe({
      next: () => {
        this.queryText = '';
        this.loadQueries();
      },
      error: () => {
        this.errorMessage = 'Unable to send message.';
      },
    });
  }

  // ---- Helpers ----
  isStaffMember(email: string | null | undefined): boolean {
    if (!email) return false;
    const lowerEmail = email.toLowerCase();
    const inStaff = this.staff.some(s => s.email?.toLowerCase() === lowerEmail);
    if (inStaff) return true;
    return lowerEmail.endsWith('@wigweuniversity.edu.ng');
  }

  getResumeUrl(filePath: string | null | undefined): string {
    if (!filePath) return '';
    const token = this.authService.getAccessToken() || localStorage.getItem('token') || '';
    return `${environment.apiUrl}/v1/recruitment/applications/${this.applicationId}/resume?access_token=${encodeURIComponent(token)}`;
  }

  getOfferAttachmentUrl(attachmentPath: string | null | undefined): string {
    if (!attachmentPath) return '';
    return `${environment.apiUrl}${attachmentPath}`;
  }

  toggleResumePreview() {
    this.showResumePreview = !this.showResumePreview;
  }

  getSafeResumeUrl(filePath: string | null | undefined): SafeResourceUrl {
    const url = this.getResumeUrl(filePath);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getMatchColor(score: number | null): string {
    if (score === null) return 'text-gray-400';
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  }

  getScoreBg(score: number | null): string {
    if (score === null) return 'bg-gray-200';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      New: 'bg-blue-100 text-blue-700',
      Shortlisted: 'bg-indigo-100 text-indigo-700',
      Interviewing: 'bg-amber-100 text-amber-700',
      Offer: 'bg-emerald-100 text-emerald-700',
      Hired: 'bg-teal-100 text-teal-700',
      Rejected: 'bg-rose-100 text-rose-700',
      Accepted: 'bg-green-100 text-green-700',
      Declined: 'bg-red-100 text-red-700',
      Sent: 'bg-sky-100 text-sky-700',
      Draft: 'bg-gray-100 text-gray-500',
      Expired: 'bg-gray-100 text-gray-500',
      Scheduled: 'bg-cyan-100 text-cyan-700',
      Completed: 'bg-green-100 text-green-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  getInterviewStatusColor(status: string): string {
    const map: Record<string, string> = {
      Scheduled: 'bg-cyan-100 text-cyan-700',
      Completed: 'bg-green-100 text-green-700',
      Cancelled: 'bg-gray-100 text-gray-500',
      Postponed: 'bg-amber-100 text-amber-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  getOfferStatusColor(status: string): string {
    const map: Record<string, string> = {
      Draft: 'bg-gray-100 text-gray-500',
      Sent: 'bg-sky-100 text-sky-700',
      Accepted: 'bg-green-100 text-green-700',
      Declined: 'bg-red-100 text-red-700',
      Expired: 'bg-gray-100 text-gray-500',
      Cancelled: 'bg-gray-100 text-gray-500',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  get statusOptions(): string[] {
    if (!this.application) return [];
    const current = this.application.status;
    const all = ['New', 'Shortlisted', 'Interviewing', 'Offer', 'Hired', 'Rejected'];
    return all.filter((s) => s !== current);
  }

  get interviewTypeOptions(): string[] {
    return ['Phone Screen', 'Technical Interview', 'HR Interview', 'Panel Interview', 'Final Interview', 'Case Study'];
  }
}
