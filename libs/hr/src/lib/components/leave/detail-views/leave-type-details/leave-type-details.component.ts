import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output, OnInit,
} from '@angular/core';
import { LeaveTypeDto } from '../../../../dtos/leave.dto';
import { FlatButtonComponent, SubmitRoundedButtonComponent } from '@erp/core';
import { AuthService, DepartmentDto, EmploymentTypeDto, RoleDto, UserDto, UserTypeDto, VisibilityTypes } from '@erp/auth';
import { DepartmentStore, EmploymentTypeStore, RoleStore, UserTypeStore } from '../../../../state';

@Component({
  selector: 'lib-leave-type-details',
  templateUrl: './leave-type-details.component.html',
  imports: [CommonModule, FlatButtonComponent, SubmitRoundedButtonComponent],
})
export class LeaveTypeDetailsComponent implements OnInit {
  @Input() leaveType!: LeaveTypeDto | null;
  @Output() emitClose = new EventEmitter<void>();
  @Output() emitEditEvent = new EventEmitter<LeaveTypeDto>();
  VisibilityTypes = VisibilityTypes;

  userTypeStore = inject(UserTypeStore) as any;
  roleStore = inject(RoleStore) as any;
  employmentTypeStore = inject(EmploymentTypeStore) as any;
  departmentStore = inject(DepartmentStore) as any;

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
  getDepartment(departmentId: string): string {
    return this.departments().find((a: DepartmentDto) => a.id === departmentId)?.name || '';
  }
  getRoleName(roleId: string): string {
    return this.roles().find((a: RoleDto) => a.id === roleId)?.name || '';
  }
  getEmploymentTypeName(employmentTypeId: string): EmploymentTypeDto | undefined {
    return this.employmentTypes().find((em: EmploymentTypeDto) => em.id == employmentTypeId);
  }
  getUserTypeName(userTypeId: string): string {
    return this.userTypes().find((a: UserTypeDto) => (a.id = userTypeId))?.name || '';
  }
  getApproverName(type: string, value: string): string {
    switch (type) {
      case 'ROLE':
        return value;
      case 'USER':
        return this.getUserName(value);
      case 'MANAGER':
        return 'Direct Manager';
      default:
        return value;
    }
  }
  getUserName(value: string): string {
    return this.staffs.find((a: UserDto) => a.id == value)?.fullName || '';
  }
}
