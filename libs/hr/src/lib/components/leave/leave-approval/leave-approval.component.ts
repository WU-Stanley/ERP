import { Component, computed, inject, OnInit } from '@angular/core';
import { LeaveRequestApprovalStore } from '../../../state/leave-approval.store';
import { AuthService, UserDto } from '@erp/auth';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LeaveTypeStore } from '../../../state';
import {
  CustomSelectComponent,
  FlatButtonComponent,
  SubmitRoundedButtonComponent,
  SpinnerComponent,
  CustomInputComponent,
  CustomTextareaComponent,
} from '@erp/core';

@Component({
  selector: 'lib-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CustomSelectComponent,
    FlatButtonComponent,
    SubmitRoundedButtonComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    CustomInputComponent,
    CustomTextareaComponent,
  ],
})
export class LeaveApprovalComponent implements OnInit {
  showDelegationForm = false;

  leaveRequestApprovalStore = inject(LeaveRequestApprovalStore);
  leaveTypeStore = inject(LeaveTypeStore);

  user = JSON.parse(localStorage.getItem('user') || '{}');
  isLoading = computed(() => this.leaveRequestApprovalStore.isLoading());
  requestApprovals = computed(() =>
    this.leaveRequestApprovalStore.leaveApprovals()
  );
  myRequestApprovals = computed(() =>
    this.leaveRequestApprovalStore.myLeaveRequestApprovals()
  );
  leaveTypes = computed(() => this.leaveTypeStore.leaveTypes());
  authService = inject(AuthService);

  dialogVisible = false;
  dialogType: 'approve' | 'reject' | null = null;
  dialogRequestId: string | null = null;
  dialogComment = '';
  delegationForm!: FormGroup;
  users: UserDto[] = [];
  constructor(private fb: FormBuilder) {
    //
  }

  ngOnInit() {
    this.delegationForm = this.fb.group({
      delegatePersonId: ['', [Validators.required]],
      approverPersonId: [this.user.id],
      note: [''],
      startDate: [''],
      endDate: [''],
    });
    if (!this.leaveTypes().length) {
      this.leaveTypeStore.getAllLeaveTypes();
    }
    this.authService.getAllStaff().subscribe((userRes) => {
      this.users = userRes.data ?? [];
    });
    // if (
    //   this.authService.hasAnyPermission([
    //     Permissions.ManageLeave,
    //     Permissions.ApproveRequests,
    //     Permissions.RejectLeave,
    //     Permissions.RejectRequests,
    //     Permissions.AdminAccess,
    //   ])
    // ) {
    //   console.log('has permission: ', this.requestApprovals());
    //   if (!this.requestApprovals().length) {
    //     this.leaveRequestApprovalStore.getAllLeaveRequestApprovals();
    //   }
    // } else {
    console.log('does not have permission: ', this.myRequestApprovals());
    if (!this.myRequestApprovals().length) {
      this.leaveRequestApprovalStore.getMyLeaveRequestApprovals(this.user.id);
    }
    // }
    console.log('isLoading ', this.isLoading());
  }
  get approvals() {
    return this.myRequestApprovals().length > 0
      ? this.myRequestApprovals()
      : this.requestApprovals();
  }
  toggleForm() {
    this.showDelegationForm = !this.showDelegationForm;
  }
  resetForm() {
    this.delegationForm.reset();
  }

  async approveReject(
    approvalId: string,
    isApproved: boolean,
    comment: string
  ) {
    const body = {
      isApproved: isApproved,
      comment: comment,
      approvalId,
    };
    await this.leaveRequestApprovalStore.approveRejectLeaveRequest(
      approvalId,
      body
    );
  }
  openDialog(requestId: string, type: 'approve' | 'reject') {
    this.dialogVisible = true;
    this.dialogType = type;
    this.dialogRequestId = requestId;
    this.dialogComment = '';
  }

  closeDialog() {
    this.dialogVisible = false;
    this.dialogType = null;
    this.dialogRequestId = null;
    this.dialogComment = '';
  }

  async confirmDialog() {
    console.log('comment: ', this.dialogComment, this.dialogRequestId);
    if (!this.dialogRequestId || !this.dialogType) return;

    const isApproved = this.dialogType === 'approve';
    await this.approveReject(
      this.dialogRequestId,
      isApproved,
      this.dialogComment
    );
    if (!this.isLoading()) {
      this.closeDialog();
    }
  }
  async submitDelegation() {
    console.log('delegation form: ', this.delegationForm.value);
    await this.leaveRequestApprovalStore.delegateApprover(
      this.delegationForm.value
    );
    if (!this.isLoading()) {
      this.resetForm();
      this.toggleForm();
    }
  }
}
