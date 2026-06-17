import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecruitmentService } from '../../../services/recruitment.service';
import { JobPostingDto, CreateJobPostingDto } from '../../../dtos/recruitment.dto';
import { RichTextEditorComponent } from '../../shared/rich-text-editor/rich-text-editor.component';
import { DepartmentService } from '@erp/auth';
import { DepartmentDto } from '@erp/auth';

@Component({
  selector: 'app-recruitment-job-postings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RichTextEditorComponent],
  templateUrl: './recruitment-job-postings.component.html',
})
export class RecruitmentJobPostingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly recruitmentService = inject(RecruitmentService);
  private readonly departmentService = inject(DepartmentService);

  jobPostings: JobPostingDto[] = [];
  departments: DepartmentDto[] = [];
  activeTab = 'all';
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  showNewJobForm = false;
  editingJob?: JobPostingDto;

  newJobForm = this.fb.group({
    title: ['', Validators.required],
    departmentId: [''],
    location: ['', Validators.required],
    employmentType: ['Full-time', Validators.required],
    description: ['', Validators.required],
    requirements: ['', Validators.required],
    deadline: [''],
    salaryRange: [''],
  });

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
    this.loadJobPostings();
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = (res.data ?? []).filter((d) => d.isActive);
      },
      error: () => {
        // Non-blocking — department dropdown will just be empty
      },
    });
  }

  loadJobPostings() {
    this.isLoading = true;
    this.errorMessage = '';
    this.recruitmentService.getJobPostings(false).subscribe({
      next: (response) => {
        this.jobPostings = response.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load job postings.';
        this.isLoading = false;
      },
    });
  }

  toggleNewJobForm() {
    this.showNewJobForm = !this.showNewJobForm;
    if (!this.showNewJobForm) {
      this.resetForm();
    }
  }

  startEdit(job: JobPostingDto) {
    this.editingJob = { ...job };
    this.newJobForm.patchValue({
      title: job.title,
      departmentId: job.departmentId || '',
      location: job.location,
      employmentType: job.employmentType || 'Full-time',
      description: job.description,
      requirements: job.requirements,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
    });
    this.showNewJobForm = true;
    // Scroll to form
    setTimeout(() => {
      document.getElementById('job-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  cancelEdit() {
    this.editingJob = undefined;
    this.resetForm();
    this.showNewJobForm = false;
  }

  saveJob() {
    if (this.newJobForm.invalid) {
      this.newJobForm.markAllAsTouched();
      return;
    }

    const raw = this.newJobForm.getRawValue();
    const payload: CreateJobPostingDto = {
      title: raw.title || '',
      description: raw.description || '',
      requirements: raw.requirements || '',
      location: raw.location || '',
      employmentType: raw.employmentType || 'Full-time',
      departmentId: raw.departmentId || null,
      deadline: raw.deadline ? new Date(raw.deadline) : undefined,
    };

    if (this.editingJob) {
      this.recruitmentService.updateJobPosting(this.editingJob.id, payload).subscribe({
        next: () => {
          this.successMessage = 'Job posting updated successfully.';
          this.errorMessage = '';
          this.cancelEdit();
          this.loadJobPostings();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Unable to update job posting.';
          this.successMessage = '';
        },
      });
    } else {
      this.recruitmentService.createJobPosting(payload).subscribe({
        next: () => {
          this.successMessage = 'Job posting created successfully.';
          this.errorMessage = '';
          this.resetForm();
          this.showNewJobForm = false;
          this.loadJobPostings();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Unable to create job posting.';
          this.successMessage = '';
        },
      });
    }
  }

  togglePublish(job: JobPostingDto) {
    const newStatus = job.status === 'Active' ? 'Draft' : 'Active';
    this.recruitmentService.updateJobPosting(job.id, { status: newStatus }).subscribe({
      next: () => {
        this.successMessage = `Job posting ${newStatus === 'Active' ? 'published' : 'unpublished'} successfully.`;
        this.errorMessage = '';
        this.loadJobPostings();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Unable to update job posting status.';
        this.successMessage = '';
      },
    });
  }

  deleteJob(id: string) {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    this.recruitmentService.deleteJobPosting(id).subscribe({
      next: () => {
        this.successMessage = 'Job posting deleted.';
        this.errorMessage = '';
        this.loadJobPostings();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Unable to delete job posting.';
        this.successMessage = '';
      },
    });
  }

  resetForm() {
    this.newJobForm.reset({
      title: '',
      departmentId: '',
      location: '',
      employmentType: 'Full-time',
      description: '',
      requirements: '',
      deadline: '',
      salaryRange: '',
    });
  }

  get filteredJobs() {
    if (this.activeTab === 'active') return this.jobPostings.filter((j) => j.status === 'Active');
    if (this.activeTab === 'inactive') return this.jobPostings.filter((j) => j.status !== 'Active');
    return this.jobPostings;
  }

  get activeCount() {
    return this.jobPostings.filter((j) => j.status === 'Active').length;
  }

  get inactiveCount() {
    return this.jobPostings.filter((j) => j.status !== 'Active').length;
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Active: 'bg-emerald-100 text-emerald-700',
      Draft: 'bg-amber-100 text-amber-700',
      Archived: 'bg-gray-100 text-gray-500',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }
}
