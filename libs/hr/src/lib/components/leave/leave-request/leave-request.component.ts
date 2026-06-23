import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import {
  AddButtonComponent,
  CancelButtonComponent,
  SubmitRoundedButtonComponent,
  CancelRoundedButtonComponent,
  FlatButtonComponent,
  AlertService,
} from '@erp/core';
import { LeaveRequestStore } from '../../../state/leave-request.store';
import { LeaveRequestFormComponent } from '../../forms/leave-request-form/leave-request-form.component';
import { WordSlicePipe } from '../../../pipes/word-slice.pipe';
import { LeaveRequestDto, LeaveTypeDto } from '../../../dtos';

@Component({
  selector: 'lib-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
  imports: [
    CommonModule,
    AddButtonComponent,
    LeaveRequestFormComponent,
    WordSlicePipe,
    SubmitRoundedButtonComponent,
    FlatButtonComponent,
  ],
})
export class LeaveRequestComponent implements OnInit {
  leaveRequestStore = inject(LeaveRequestStore);

  showMenu = false;
  leaveRequests = computed(() => this.leaveRequestStore.leaveRequests());
  isLoading = computed(() => this.leaveRequestStore.isLoading());
  error = computed(() => this.leaveRequestStore.error());
  isEditing = computed(() => this.leaveRequestStore.isEditing());
  user = JSON.parse(localStorage.getItem('user') || '{}');
  activeMenuIndex: number | null = null;
  showRequestForm = false;
  editingLeaveRequest: LeaveRequestDto | null = null;
  recentLeaveRequest!: LeaveRequestDto | null;

  constructor(private alertService: AlertService) {
    // Initialize any necessary data or state
  }

  ngOnInit() {
    console.log('user: ', this.user);
    if (this.leaveRequests().length === 0) {
      this.leaveRequestStore.myLeaveRequests(this.user.id).then((res) => {
        this.recentLeaveRequest = this.leaveRequests()[0] || null;
        console.log('recent leave request type: ', this.recentLeaveRequest);
      });
    }
  }
  toggleMenu(index: number) {
    this.showMenu = !this.showMenu;
    this.activeMenuIndex = this.showMenu ? index : null;
  }
  toggleLeaveRequestForm() {
    if (this.showRequestForm) {
      this.editingLeaveRequest = null;
      this.recentLeaveRequest = this.leaveRequests()[0] ?? null;
    }
    this.showRequestForm = !this.showRequestForm;
  }
  async deleteLeave(leave: LeaveRequestDto) {
    if (!leave.id) {
      return;
    }

    const confirmed = await this.alertService.confirm(
      'Withdraw this pending leave request?',
      'Withdraw'
    );
    if (!confirmed) {
      return;
    }

    await this.leaveRequestStore.deleteLeaveRequest(leave.id);
    const error = this.leaveRequestStore.error();
    if (error) {
      this.alertService.showError(error);
    } else {
      this.alertService.showSuccess('Leave request withdrawn successfully.');
      if (this.recentLeaveRequest?.id === leave.id) {
        this.recentLeaveRequest = this.leaveRequests()[0] ?? null;
      }
    }
    this.activeMenuIndex = null;
  }
  editLeave(leave: LeaveRequestDto) {
    this.editingLeaveRequest = leave;
    this.showRequestForm = true;
    this.activeMenuIndex = null;
  }
}
