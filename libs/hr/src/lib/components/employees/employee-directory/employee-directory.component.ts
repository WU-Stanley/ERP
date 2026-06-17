import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, Permissions } from '@erp/auth';
import { EmployeeDirectoryDto, PaginatedResponse } from '../../../dtos/employee.dto';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'lib-employee-directory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-directory.component.html',
})
export class EmployeeDirectoryComponent implements OnInit {
  employees: EmployeeDirectoryDto[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 100;
  totalPages = 0;
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  currentUser = (() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  })();

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        const page = response.data;
        this.employees = page?.items ?? [];
        this.totalCount = page?.totalCount ?? this.employees.length;
        this.pageNumber = page?.pageNumber ?? 1;
        this.pageSize = page?.pageSize ?? this.pageSize;
        this.totalPages = page?.totalPages ?? Math.ceil(this.totalCount / this.pageSize);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load employee directory.';
        this.isLoading = false;
      },
    });
  }

  get filteredEmployees() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.employees;
    }

    return this.employees.filter((employee) =>
      [
        employee.fullName,
        employee.email,
        employee.jobTitle,
        employee.departmentName,
        employee.employmentTypeName,
        employee.employmentStatus,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }

  get activeCount() {
    return this.employees.filter((employee) => employee.isActive).length;
  }

  get departmentCount() {
    return new Set(
      this.employees
        .map((employee) => employee.departmentName)
        .filter((department) => department?.trim())
    ).size;
  }

  get canManageEmployees() {
    return this.authService.hasAnyPermission([
      Permissions.AdminAccess,
      Permissions.SuperAdminAccess,
      Permissions.ManageUsers,
      Permissions.CreateUser,
      Permissions.UpdateEmployeeProfiles,
    ]);
  }

  get canViewEmployeeRecords() {
    return this.authService.hasAnyPermission([
      Permissions.AdminAccess,
      Permissions.SuperAdminAccess,
      Permissions.ViewEmployeeProfiles,
      Permissions.ViewDepartmentEmployeeProfiles,
      Permissions.ManageUsers,
    ]);
  }

  get currentEmployee() {
    const userId = this.currentUser?.id;
    if (!userId) {
      return null;
    }

    return this.employees.find((employee) => employee.userId === userId) ?? null;
  }

  showMyRecord() {
    const identifier = this.currentEmployee?.email || this.currentUser?.userEmail || '';
    this.searchTerm = identifier;
  }

  statusClass(employee: EmployeeDirectoryDto) {
    if (!employee.isActive) {
      return 'bg-slate-100 text-slate-600';
    }

    const status = employee.employmentStatus?.toLowerCase();
    if (status === 'active') {
      return 'bg-emerald-50 text-emerald-700';
    }

    return 'bg-amber-50 text-amber-700';
  }

  trackByEmployeeId(_: number, employee: EmployeeDirectoryDto) {
    return employee.employeeId;
  }
}
