import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { AddButtonComponent, FlatButtonComponent } from '@erp/core';
import { LeaveTypeService } from '../../../services/leave-type.service';
import { LeaveTypeDto } from '../../../dtos/leave.dto';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaveTypeFormComponent } from '../../forms/leave-type-form/leave-type-form.component';
import { LeaveTypeStore } from '../../../state';
import { LeavePolicyFormComponent } from '../../forms/leave-policy-form/leave-policy-form.component';
import { LeaveRequestFormComponent } from '../../forms/leave-request-form/leave-request-form.component';
import { AuthService, HasAnyPermissionDirective, Permissions } from '@erp/auth';
import { LeaveTypeDetailsComponent } from '../detail-views/leave-type-details/leave-type-details.component';

@Component({
  selector: 'lib-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddButtonComponent,
    LeaveTypeFormComponent,
    LeavePolicyFormComponent,
    LeaveRequestFormComponent,
    LeaveTypeDetailsComponent,
    HasAnyPermissionDirective,
  ],
  // providers: [LeaveTypeStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveTypeComponent implements OnInit {
  showForm = false;
  private readonly leaveTypeStore = inject(LeaveTypeStore);
  hrAdminPermissions = [Permissions.ManageLeave];
  authService = inject(AuthService);

  // Reactive signals for view binding
  readonly leaveTypes = computed(() => this.leaveTypeStore.leaveTypes());
  readonly selectedLeaveType = computed(() =>
    this.leaveTypeStore.selectedLeaveType()
  );
  readonly isLoading = computed(() => this.leaveTypeStore.isLoading());
  readonly error = computed(() => this.leaveTypeStore.error());
  readonly isEditing = computed(() => this.leaveTypeStore.isEditing());
  showPolicyForm = false;
  showRequestForm = false;
  readonly = false;
  showLeaveTypeDetails = false;

  constructor(private leaveTypeService: LeaveTypeService) {}

  ngOnInit() {
    if (
      this.authService.hasAnyPermission([
        Permissions.ManageLeave,
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ])
    ) {
      this.leaveTypeStore.getAllLeaveTypes();
    } else {
      this.leaveTypeStore.getMyLeaveTypes();
    }
    setTimeout(() => {
      console.log('leave types: ', this.leaveTypes());
    }, 1000);
  }
  closeLeaveTypeDetails() {
    this.showLeaveTypeDetails = false;
  }
  toggleLeaveRequestForm() {
    this.showRequestForm = !this.showRequestForm;
    this.showForm = false;
    this.showPolicyForm = false;
    this.toggleMenu(this.activeMenuIndex!);
  }
  addLeavePolicy(leaveTypeId: string) {
    this.leaveTypeStore.selectLeaveTypeById(leaveTypeId);
    this.toggleLeavePolicyForm();
    this.toggleMenu(this.activeMenuIndex!);
  }
  toggleLeavePolicyForm() {
    this.showPolicyForm = !this.showPolicyForm;
    this.showForm = false;
    if (this.readonly) this.readonly = false;
  }
  toggleLeaveTypeForm() {
    this.showForm = !this.showForm;
    this.showPolicyForm = false;
  }
  getLeaveTypes() {
    this.leaveTypeService.getLeaveTypes().subscribe((res) => {
      // this.leaveTypes = res.data ?? [];
      console.log('leave types: ', res);
    });
  }
  activeMenuIndex: number | null = null;

  toggleMenu(index: number) {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }

  viewLeaveType(id: string) {
    console.log('index: ', id);
    const index = this.leaveTypes().findIndex((a) => a.id == id);
    const leaveType = this.leaveTypes().find((a) => a.id == id);
    this.leaveTypeStore.selectLeaveTypeById(id);

    this.showLeaveTypeDetails = true;
    this.showForm = false;
    this.showPolicyForm = false;
    this.toggleMenu(this.activeMenuIndex!);
  }
  viewPolicies(leaveTypeId: string) {
    console.log('View Policies for Leave Type ID: ', leaveTypeId);
    this.leaveTypeStore.selectLeaveTypeById(leaveTypeId);

    this.toggleLeavePolicyForm();
    this.readonly = true;
    this.toggleMenu(this.activeMenuIndex!);
  }
  editLeaveType(leaveType: LeaveTypeDto) {
    console.log('id: ', leaveType.id);
    this.leaveTypeStore.selectLeaveTypeById(leaveType.id);
    this.showLeaveTypeDetails = false;
    this.toggleLeaveTypeForm();
    this.toggleMenu(this.activeMenuIndex!);
  }
  getRoleName(roleId: string): string {
    // const role = this.leaveTypeStore.roles().find((r) => r.id === roleId);
    // return role ? role.name : 'Unknown Role';
    return '';
  }
  getEmploymentTypeName(employmentTypeId: string): string {
    return '';
  }
  getContractTypeName(contractTypeId: string): string {
    return '';
  }
}
