import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import {
  AddButtonComponent,
  CancelButtonComponent,
  SubmitRoundedButtonComponent,
  CancelRoundedButtonComponent,
  FlatButtonComponent,
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
  recentLeaveRequest!: LeaveRequestDto | null;

  constructor() {
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
    this.showRequestForm = !this.showRequestForm;
  }
  deleteLeave(leave: any) {
    // Implement delete logic here
    this.activeMenuIndex = null;
  }
  editLeave(leave: any) {
    // Implement edit logic here
    this.activeMenuIndex = null;
  }
}
