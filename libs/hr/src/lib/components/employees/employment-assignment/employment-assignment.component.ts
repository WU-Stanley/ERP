import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  AuthService,
  DepartmentService,
  DepartmentDto,
  EmploymentTypeDto,
  JobCategoryDto,
  UserDto,
} from '@erp/auth';
import { EmployeeDetailsDto, EmploymentDetailsDto } from '../../../dtos/employee.dto';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'lib-employment-assignment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employment-assignment.component.html',
})
export class EmploymentAssignmentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  employee: EmployeeDetailsDto | null = null;
  currentEmployment: EmploymentDetailsDto | null = null;
  actionMode: 'assignment' | 'transfer' | 'supervisor' | 'end' = 'assignment';
  departments: DepartmentDto[] = [];
  employmentTypes: EmploymentTypeDto[] = [];
  jobCategories: JobCategoryDto[] = [];
  staff: UserDto[] = [];
  isLoading = true;
  isSaving = false;
  isEndingEmployment = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    departmentId: ['', Validators.required],
    jobTitle: ['', Validators.required],
    employmentTypeId: ['', Validators.required],
    employmentStatus: ['Active', Validators.required],
    gradeLevel: [''],
    dateOfHire: [new Date().toISOString().substring(0, 10), Validators.required],
    probationEndDate: [''],
    supervisorId: [''],
    jobCategoryId: [''],
    benefits: [''],
    promotionHistory: [''],
    transferHistory: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    const mode = this.route.snapshot.queryParamMap.get('mode');
    if (mode === 'transfer' || mode === 'supervisor' || mode === 'end') {
      this.actionMode = mode;
    }

    if (!employeeId) {
      this.errorMessage = 'Employee ID is missing.';
      this.isLoading = false;
      return;
    }

    this.loadPage(employeeId);
  }

  private loadPage(employeeId: string) {
    let pending = 5;
    const finish = () => {
      pending -= 1;
      if (pending === 0) {
        this.isLoading = false;
        this.patchFromCurrentEmployment();
      }
    };

    this.employeeService.getEmployee(employeeId).subscribe({
      next: (response) => {
        this.employee = response.data ?? null;
        this.currentEmployment =
          this.employee?.employments?.find((employment) => employment.isActive) ??
          this.employee?.employments?.[0] ??
          null;
        finish();
      },
      error: () => {
        this.errorMessage = 'Unable to load employee profile.';
        finish();
      },
    });

    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.data ?? [];
        finish();
      },
      error: () => finish(),
    });

    this.authService.getEmploymentTypes().subscribe({
      next: (response) => {
        this.employmentTypes = response.data ?? [];
        finish();
      },
      error: () => finish(),
    });

    this.authService.getJobCategories().subscribe({
      next: (response) => {
        this.jobCategories = response.data ?? [];
        finish();
      },
      error: () => finish(),
    });

    this.authService.getAllStaff().subscribe({
      next: (response) => {
        this.staff = response.data ?? [];
        finish();
      },
      error: () => finish(),
    });
  }

  private patchFromCurrentEmployment() {
    if (!this.currentEmployment) {
      return;
    }

    this.form.patchValue({
      departmentId: this.currentEmployment.departmentId ?? '',
      jobTitle: this.currentEmployment.jobTitle ?? '',
      employmentTypeId: this.currentEmployment.employmentTypeId ?? '',
      employmentStatus: this.currentEmployment.employmentStatus || 'Active',
      gradeLevel: this.currentEmployment.gradeLevel ?? '',
      dateOfHire: this.toDateInput(this.currentEmployment.dateOfHire) || new Date().toISOString().substring(0, 10),
      probationEndDate: this.toDateInput(this.currentEmployment.probationEndDate ?? undefined),
      supervisorId: this.currentEmployment.supervisorId ?? '',
      jobCategoryId: this.currentEmployment.jobCategoryId ?? '',
      benefits: this.currentEmployment.benefits ?? '',
      promotionHistory: this.currentEmployment.promotionHistory ?? '',
      transferHistory: this.currentEmployment.transferHistory ?? '',
    });
  }

  save() {
    if (!this.employee) {
      this.errorMessage = 'Employee profile is not loaded.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const invalidFields: string[] = [];
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control && control.invalid) {
          // Format the field name to be user-friendly
          const friendlyName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          invalidFields.push(friendlyName);
        }
      });
      this.errorMessage = `Please fill in all required fields: ${invalidFields.join(', ')}.`;
      console.warn('Form validation failed for fields:', invalidFields);
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const value = this.form.getRawValue();
    this.employeeService
      .assignEmployment(this.employee.employeeId, {
        departmentId: value.departmentId,
        jobTitle: value.jobTitle,
        employmentTypeId: value.employmentTypeId,
        employmentStatus: value.employmentStatus,
        gradeLevel: value.gradeLevel,
        dateOfHire: value.dateOfHire,
        probationEndDate: value.probationEndDate || null,
        supervisorId: value.supervisorId || null,
        jobCategoryId: value.jobCategoryId || null,
        benefits: value.benefits,
        promotionHistory: value.promotionHistory,
        transferHistory: value.transferHistory,
      })
      .subscribe({
        next: () => {
          this.successMessage = this.saveSuccessMessage;
          this.router.navigate(['/hr/employees', this.employee?.employeeId]);
        },
        error: (err) => {
          console.error('Error assigning employment:', err);
          this.errorMessage = err?.error?.message || err?.message || 'Unable to save employment assignment.';
          this.isSaving = false;
        },
      });
  }

  endCurrentEmployment() {
    if (!this.currentEmployment || !this.employee) {
      return;
    }

    const confirmed = window.confirm(
      `End the current employment record for ${this.employee.firstName} ${this.employee.lastName}?`
    );
    if (!confirmed) {
      return;
    }

    this.isEndingEmployment = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.employeeService.endEmployment(this.currentEmployment.employmentId).subscribe({
      next: () => {
        this.router.navigate(['/hr/employees', this.employee?.employeeId]);
      },
      error: () => {
        this.errorMessage = 'Unable to end current employment.';
        this.isEndingEmployment = false;
      },
    });
  }

  setMode(mode: 'assignment' | 'transfer' | 'supervisor' | 'end') {
    this.actionMode = mode;
  }

  get pageTitle() {
    if (this.actionMode === 'transfer') {
      return 'Transfer Department';
    }
    if (this.actionMode === 'supervisor') {
      return 'Assign Supervisor';
    }
    if (this.actionMode === 'end') {
      return 'End Employment';
    }
    return 'Employment Assignment';
  }

  get pageDescription() {
    if (this.actionMode === 'transfer') {
      return 'Create a new active employment record and close the previous department assignment.';
    }
    if (this.actionMode === 'supervisor') {
      return 'Update the reporting line by saving a new active employment record with the selected supervisor.';
    }
    if (this.actionMode === 'end') {
      return 'Close the current active employment record without creating a new assignment.';
    }
    return 'Update role, department, reporting line, and employment status.';
  }

  get saveButtonLabel() {
    if (this.actionMode === 'transfer') {
      return 'Save Transfer';
    }
    if (this.actionMode === 'supervisor') {
      return 'Save Supervisor';
    }
    return 'Save Employment';
  }

  get saveSuccessMessage() {
    if (this.actionMode === 'transfer') {
      return 'Transfer saved successfully.';
    }
    if (this.actionMode === 'supervisor') {
      return 'Supervisor assignment saved successfully.';
    }
    return 'Employment assignment saved successfully.';
  }

  get canEndEmployment() {
    return Boolean(this.currentEmployment?.isActive);
  }

  private toDateInput(value?: string | null) {
    return value ? value.substring(0, 10) : '';
  }
}
