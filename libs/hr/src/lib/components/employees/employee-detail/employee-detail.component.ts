import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService, Permissions } from '@erp/auth';
import { EmployeeDetailsDto, EmploymentDetailsDto } from '../../../dtos/employee.dto';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'lib-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-detail.component.html',
})
export class EmployeeDetailComponent implements OnInit {
  employee: EmployeeDetailsDto | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private authService: AuthService
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
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load employee profile.';
        this.isLoading = false;
      },
    });
  }

  get fullName() {
    return [this.employee?.firstName, this.employee?.middleName, this.employee?.lastName]
      .filter(Boolean)
      .join(' ');
  }

  get currentEmployment(): EmploymentDetailsDto | null {
    return (
      this.employee?.employments
        ?.slice()
        .sort((a, b) => Number(b.isActive) - Number(a.isActive))[0] ?? null
    );
  }

  get canEditProfile() {
    return this.authService.hasAnyPermission([
      Permissions.AdminAccess,
      Permissions.SuperAdminAccess,
      Permissions.ManageUsers,
      Permissions.UpdateEmployeeProfiles,
    ]);
  }

  get canManageEmployment() {
    return this.authService.hasAnyPermission([
      Permissions.AdminAccess,
      Permissions.SuperAdminAccess,
      Permissions.ManageUsers,
      Permissions.UpdateEmployeeProfiles,
      Permissions.AssignSupervisor,
    ]);
  }

  statusClass(employment: EmploymentDetailsDto | null) {
    if (!employment?.isActive) {
      return 'bg-slate-100 text-slate-600';
    }

    return employment.employmentStatus?.toLowerCase() === 'active'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-amber-50 text-amber-700';
  }
}
