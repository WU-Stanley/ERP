import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeDetailsDto } from '../../../dtos/employee.dto';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'lib-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-edit.component.html',
})
export class EmployeeEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  employee: EmployeeDetailsDto | null = null;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    address: [''],
    dateOfBirth: [''],
    gender: [''],
    maritalStatus: [''],
    nationality: [''],
    emergencyContactName: [''],
    emergencyContactPhone: [''],
    relationship: [''],
    bankName: [''],
    bankAccountNumber: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (!employeeId) {
      this.errorMessage = 'Employee ID is missing.';
      this.isLoading = false;
      return;
    }

    this.employeeService.getEmployee(employeeId).subscribe({
      next: (response) => {
        this.employee = response.data ?? null;
        if (!this.employee) {
          this.errorMessage = 'Employee profile was not found.';
        } else {
          this.form.patchValue({
            firstName: this.employee.firstName ?? '',
            middleName: this.employee.middleName ?? '',
            lastName: this.employee.lastName ?? '',
            email: this.employee.email ?? '',
            phoneNumber: this.employee.phoneNumber ?? '',
            address: this.employee.address ?? '',
            dateOfBirth: this.toDateInput(this.employee.dateOfBirth),
            gender: this.employee.gender ?? '',
            maritalStatus: this.employee.maritalStatus ?? '',
            nationality: this.employee.nationality ?? '',
            emergencyContactName: this.employee.emergencyContactName ?? '',
            emergencyContactPhone: this.employee.emergencyContactPhone ?? '',
            relationship: this.employee.relationship ?? '',
            bankName: this.employee.bankName ?? '',
            bankAccountNumber: this.employee.bankAccountNumber ?? '',
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load employee profile.';
        this.isLoading = false;
      },
    });
  }

  save() {
    if (!this.employee || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const value = this.form.getRawValue();
    const payload: EmployeeDetailsDto = {
      ...this.employee,
      firstName: value.firstName,
      middleName: value.middleName,
      lastName: value.lastName,
      email: value.email,
      phoneNumber: value.phoneNumber,
      address: value.address,
      dateOfBirth: value.dateOfBirth || undefined,
      gender: value.gender,
      maritalStatus: value.maritalStatus,
      nationality: value.nationality,
      emergencyContactName: value.emergencyContactName,
      emergencyContactPhone: value.emergencyContactPhone,
      relationship: value.relationship,
      bankName: value.bankName,
      bankAccountNumber: value.bankAccountNumber,
    };

    this.employeeService.updateEmployee(payload).subscribe({
      next: () => {
        this.successMessage = 'Employee profile updated successfully.';
        this.isSaving = false;
        this.router.navigate(['/hr/employees', payload.employeeId]);
      },
      error: () => {
        this.errorMessage = 'Unable to update employee profile.';
        this.isSaving = false;
      },
    });
  }

  private toDateInput(value?: string) {
    return value ? value.substring(0, 10) : '';
  }
}
