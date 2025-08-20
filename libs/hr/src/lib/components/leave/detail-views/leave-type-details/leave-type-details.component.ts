import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { LeaveTypeDto } from 'libs/hr/src/lib/dtos';
import { FlatButtonComponent, SubmitRoundedButtonComponent } from '@erp/core';
import { AuthService, UserDto, VisibilityTypes } from '@erp/auth';
import {
  DepartmentStore,
  EmploymentTypeStore,
  RoleStore,
  UserTypeStore,
} from 'libs/hr/src/lib/state';

@Component({
  selector: 'lib-leave-type-details',
  templateUrl: './leave-type-details.component.html',
  imports: [CommonModule, FlatButtonComponent, SubmitRoundedButtonComponent],
})
export class LeaveTypeDetailsComponent {
  @Input() leaveType!: LeaveTypeDto | null;
  @Output() emitClose = new EventEmitter<void>();
  @Output() emitEditEvent = new EventEmitter<LeaveTypeDto>();
  VisibilityTypes = VisibilityTypes;

  userTypeStore = inject(UserTypeStore);
  roleStore = inject(RoleStore);
  employmentTypeStore = inject(EmploymentTypeStore);
  departmentStore = inject(DepartmentStore);

  userTypes = computed(() => this.userTypeStore.userTypes());
  roles = computed(() => this.roleStore.roles());
  employmentTypes = computed(() => this.employmentTypeStore.employmentTypes());
  departments = computed(() => this.departmentStore.departments());
  staffs: UserDto[] = [];
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.getAllStaff().subscribe((res) => {
      this.staffs = res.data ?? [];
    });
    if (this.departments().length === 0) {
      this.departmentStore.getAllDepartments();
    }
    if (this.userTypes().length === 0) {
      this.userTypeStore.getAllUserTypes();
    }
    if (this.roles().length === 0) {
      this.roleStore.getAllRoles();
    }
    if (this.employmentTypes().length === 0) {
      this.employmentTypeStore.getAllEmploymentTypes();
    }
  }

  toggleDetails(): void {
    this.emitClose.emit();
  }

  editType(type: LeaveTypeDto | null): void {
    if (!type) return;
    this.emitEditEvent.emit(type);
  }
  getDepartment(departmentId: string) {
    return this.departments().find((a) => a.id === departmentId)?.name || '';
  }
  getRoleName(roleId: string) {
    return this.roles().find((a) => a.id === roleId)?.name || '';
  }
  getEmploymentTypeName(employmentTypeId: string) {
    return this.employmentTypes().find((em) => em.id == employmentTypeId);
  }
  getUserTypeName(userTypeId: string) {
    return this.userTypes().find((a) => (a.id = userTypeId))?.name || '';
  }
  getApproverName(type: string, value: string): string {
    switch (type) {
      case 'ROLE':
        return value; // maps roleId → roleName
      case 'USER':
        return this.getUserName(value); // maps userId → display name
      case 'MANAGER':
        return 'Direct Manager'; // fixed meaning
      default:
        return value; // fallback (raw string)
    }
  }
  getUserName(value: string) {
    return this.staffs.find((a) => a.id == value)?.fullName || '';
  }
}
