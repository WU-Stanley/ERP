import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JobPostingDto } from '../../../dtos/recruitment.dto';
import { RecruitmentService } from '../../../services/recruitment.service';
import { RichTextEditorComponent } from '../../shared/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-public-job-detail',
  templateUrl: './public-job-detail.component.html',
  imports: [CommonModule, FormsModule, RouterModule, RichTextEditorComponent],
})
export class PublicJobDetailComponent implements OnInit {
  job: JobPostingDto | null = null;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  applicationReference = '';
  selectedResume: File | undefined;
  otherDocuments: File[] = [];

  applicationForm = {
    applicantName: '',
    email: '',
    phone: '',
    coverLetter: '',
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recruitmentService: RecruitmentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Job posting was not found.';
      this.isLoading = false;
      return;
    }

    this.recruitmentService.getJobPosting(id).subscribe({
      next: (response) => {
        this.job = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load this job posting.';
        this.isLoading = false;
      },
    });
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedResume = input.files?.[0];
  }

  onOtherDocumentsSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.otherDocuments = input.files ? Array.from(input.files) : [];
  }

  submitApplication(): void {
    if (!this.job || this.isSubmitting) return;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    this.recruitmentService.applyForJob(this.job.id, this.applicationForm, this.selectedResume, this.otherDocuments).subscribe({
      next: (response) => {
        this.applicationReference = response.data?.id ?? '';
        this.successMessage = 'Application submitted successfully.';
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to submit your application.';
        this.isSubmitting = false;
      },
    });
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'No deadline';
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  isClosed(): boolean {
    if (!this.job) return true;
    return this.job.status !== 'Active' || (!!this.job.deadline && new Date(this.job.deadline) < new Date());
  }
}
