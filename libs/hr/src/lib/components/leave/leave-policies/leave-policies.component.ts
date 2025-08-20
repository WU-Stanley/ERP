import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SubmitRoundedButtonComponent,
  FlatButtonComponent,
  CustomInputComponent,
  CustomSelectComponent,
  AddButtonComponent,
  AlertService,
} from '@erp/core';
import { LeavePolicyDto, LeaveTypeDto } from '../../../dtos/leave.dto';
import { EmploymentTypeService } from '../../../services/employment-type.service';
import { LeaveTypeService } from '../../../services/leave-type.service';
import { EmploymentTypeDto } from '@erp/auth';
import { LeavePolicyFormComponent } from '../../forms/leave-policy-form/leave-policy-form.component';
import {
  EmploymentTypeStore,
  LeavePolicyStore,
  LeaveTypeStore,
} from '../../../state';
import { LeavePolicyDetailComponent } from '../detail-views/leave-policy-detail/leave-policy-detail.component';

@Component({
  selector: 'lib-leave-policies',
  templateUrl: './leave-policies.component.html',
  styleUrls: ['./leave-policies.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LeavePolicyFormComponent,
    AddButtonComponent,
    LeavePolicyDetailComponent,
  ],
})
export class LeavePoliciesComponent implements OnInit {
  showPolicyDetails = false;

  editIndex!: number;

  leavePolicyForm!: FormGroup;

  showForm = false;
  leaveTypeStore = inject(LeaveTypeStore);
  employmentTypeStore = inject(EmploymentTypeStore);
  leavePolicyStore = inject(LeavePolicyStore);
  alertService = inject(AlertService);

  leavePolicies = computed(() => this.leavePolicyStore.leavePolicys());
  employmentTypes = computed(() => this.employmentTypeStore.employmentTypes());
  isEditing = computed(() => this.leavePolicyStore.isEditing());
  isLoading = computed(() => this.leavePolicyStore.isLoading());
  selectedLeaveType = computed(() => this.leaveTypeStore.selectedLeaveType());
  leaveTypes = computed(() => this.leaveTypeStore.leaveTypes());
  selectedLeavePolicy = computed(() =>
    this.leavePolicyStore.selectedLeavePolicy()
  );
  deleting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    console.log('Leave Policies Component Initialized');
    if (this.leavePolicies().length === 0) {
      this.leavePolicyStore.getAllLeavePolicys();
    }
    if (!this.employmentTypes().length) {
      this.employmentTypeStore.getAllEmploymentTypes();
    }
    if (!this.leaveTypes().length) {
      this.leaveTypeStore.getAllLeaveTypes();
    }
  }

  deletePolicy(id: string) {
    this.deleting = true;
    this.leavePolicyStore.deleteLeavePolicy(id);
    if (!this.isLoading()) {
      this.deleting = false;

      this.alertService.showSuccess('Leave Policy deleted successfully');
    }
  }
  activeMenuIndex: number | null = null;
  view(id: string) {
    console.log('leave policy id: ', id);

    this.leavePolicyStore.selectLeavePolicyById(id);

    this.showPolicyDetails = true;
    this.toggleMenu(this.activeMenuIndex ?? 0);
  }

  toggleMenu(index: number) {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }
  togglePolicyDetails() {
    this.showPolicyDetails = false;
  }
  editPolicy(policy: LeavePolicyDto) {
    this.leavePolicyStore.selectLeavePolicyById(policy.id as string);

    this.toggleForm();

    this.toggleMenu(this.activeMenuIndex!);
    this.leavePolicyStore.toggleEditing();
  }

  showEdit(index: number) {
    this.editIndex = index;
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }
}
