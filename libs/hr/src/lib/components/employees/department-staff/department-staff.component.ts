import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService, DepartmentDto, DepartmentService, Permissions } from '@erp/auth';
import { EmployeeDirectoryDto } from '../../../dtos/employee.dto';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'lib-department-staff',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './department-staff.component.html',
})
export class DepartmentStaffComponent implements OnInit {
  department: DepartmentDto | null = null;
  employees: EmployeeDirectoryDto[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const departmentId = this.route.snapshot.paramMap.get('id');
    if (!departmentId) {
      this.errorMessage = 'Department ID is missing.';
      this.isLoading = false;
      return;
    }

    this.loadDepartmentStaff(departmentId);
  }

  private loadDepartmentStaff(departmentId: string) {
    let pending = 2;
    const finish = () => {
      pending -= 1;
      if (pending === 0) {
        this.isLoading = false;
      }
    };

    this.departmentService.getDepartmentById(departmentId).subscribe({
      next: (response) => {
        this.department = response.data ?? null;
        finish();
      },
      error: () => {
        this.errorMessage = 'Unable to load department.';
        finish();
      },
    });

    this.employeeService.getDepartmentEmployees(departmentId).subscribe({
      next: (response) => {
        this.employees = response.data ?? [];
        finish();
      },
      error: () => {
        this.errorMessage = 'Unable to load department staff.';
        finish();
      },
    });
  }

  get activeCount() {
    return this.employees.filter((employee) => employee.isActive).length;
  }

  get canEditProfiles() {
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

  statusClass(employee: EmployeeDirectoryDto) {
    if (!employee.isActive) {
      return 'bg-slate-100 text-slate-600';
    }

    return employee.employmentStatus?.toLowerCase() === 'active'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-amber-50 text-amber-700';
  }

  trackByEmployeeId(_: number, employee: EmployeeDirectoryDto) {
    return employee.employeeId;
  }
}
