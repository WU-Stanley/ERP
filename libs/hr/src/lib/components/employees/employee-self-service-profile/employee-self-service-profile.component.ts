import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeDetailsDto, EmployeeProfileUpdateRequestDto } from '../../../dtos/employee.dto';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'lib-employee-self-service-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-self-service-profile.component.html',
})
export class EmployeeSelfServiceProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  employee: EmployeeDetailsDto | null = null;
  requests: EmployeeProfileUpdateRequestDto[] = [];
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    phoneNumber: [''],
    address: [''],
    emergencyContactName: [''],
    emergencyContactPhone: [''],
    relationship: [''],
    bankName: [''],
    bankAccountNumber: [''],
    cvUrl: [''],
    identificationUrl: [''],
    certificateUrl: [''],
  });

  isUploadingCv = false;
  isUploadingId = false;
  isUploadingCert = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getOwnEmployee().subscribe({
      next: (response) => {
        this.employee = response.data ?? null;
        if (!this.employee) {
          this.errorMessage = 'Your employee profile was not found.';
        } else {
          this.form.patchValue({
            phoneNumber: this.employee.phoneNumber ?? '',
            address: this.employee.address ?? '',
            emergencyContactName: this.employee.emergencyContactName ?? '',
            emergencyContactPhone: this.employee.emergencyContactPhone ?? '',
            relationship: this.employee.relationship ?? '',
            bankName: this.employee.bankName ?? '',
            bankAccountNumber: this.employee.bankAccountNumber ?? '',
            cvUrl: this.employee.cvUrl ?? '',
            identificationUrl: this.employee.identificationUrl ?? '',
            certificateUrl: this.employee.certificateUrl ?? '',
          });
        }
        this.loadRequests();
      },
      error: () => {
        this.errorMessage = 'Unable to load your profile.';
        this.isLoading = false;
      },
    });
  }

  private loadRequests() {
    this.employeeService.getOwnProfileUpdateRequests().subscribe({
      next: (response) => {
        this.requests = response.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.requests = [];
        this.isLoading = false;
      },
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.employeeService.submitOwnProfileUpdateRequest(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.requests = response.data ? [response.data, ...this.requests] : this.requests;
        this.successMessage = 'Your profile update request has been submitted for HR review.';
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'Unable to submit your profile update request.';
        this.isSaving = false;
      },
    });
  }

  statusClass(status: string) {
    const normalized = status.toLowerCase();
    if (normalized === 'approved') {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (normalized === 'rejected') {
      return 'bg-rose-50 text-rose-700';
    }
    return 'bg-amber-50 text-amber-700';
  }

  uploadFile(event: Event, field: 'cvUrl' | 'identificationUrl' | 'certificateUrl') {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    if (field === 'cvUrl') this.isUploadingCv = true;
    if (field === 'identificationUrl') this.isUploadingId = true;
    if (field === 'certificateUrl') this.isUploadingCert = true;

    this.employeeService.uploadDocument(file).subscribe({
      next: (res) => {
        if (res.data) {
          this.form.patchValue({ [field]: res.data });
          this.successMessage = 'Document uploaded successfully.';
        }
        this.clearUploadStates();
      },
      error: () => {
        this.errorMessage = 'Failed to upload document.';
        this.clearUploadStates();
      }
    });
  }

  private clearUploadStates() {
    this.isUploadingCv = false;
    this.isUploadingId = false;
    this.isUploadingCert = false;
  }
}
