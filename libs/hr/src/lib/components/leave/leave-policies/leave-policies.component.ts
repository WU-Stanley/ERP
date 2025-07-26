import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
} from '@erp/core';
import { LeavePolicyDto, LeaveTypeDto } from '../../../dtos/leave.dto';
import { EmploymentTypeService } from '../../../services/employment-type.service';
import { LeaveTypeService } from '../../../services/leave-type.service';
import { EmploymentTypeDto } from '@erp/auth';

@Component({
  selector: 'lib-leave-policies',
  templateUrl: './leave-policies.component.html',
  styleUrls: ['./leave-policies.component.css'],
  imports: [
    SubmitRoundedButtonComponent,
    FlatButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    CustomSelectComponent,
  ],
})
export class LeavePoliciesComponent implements OnInit {
  editIndex!: number;

  isProcessing = false;
  leavePolicyForm!: FormGroup;

  showForm = false;
  leavePolicies: LeavePolicyDto[] = [];
  employmentTypes: EmploymentTypeDto | undefined;
  leaveTypes: LeaveTypeDto[] | undefined;

  constructor(
    private fb: FormBuilder,
    private employmentTypeService: EmploymentTypeService,
    private leaveTypeService: LeaveTypeService
  ) {}

  ngOnInit() {
    this.leavePolicyForm = this.fb.group({
      leaveTypeId: ['', Validators.required],
      employmentType: ['', Validators.required], // e.g., "FullTime", "Contract"
      roleName: [''], // Optional
      annualEntitlement: [0, [Validators.required, Validators.min(0)]],
      isAccrualBased: [false],
      accrualRatePerMonth: [0, [Validators.min(0)]],
      maxCarryOverDays: [0, [Validators.min(0)]],
      allowNegativeBalance: [false],
    });
    this.getEmploymentTypes();
    this.getLeaveTypes();
  }
  edit(data: LeavePolicyDto) {
    this.leavePolicyForm.patchValue({
      leaveTypeId: data.leaveTypeId,
      employmentType: data.employmentType, // e.g., "FullTime", "Contract"
      roleName: data.roleName,
      annualEntitlement: data.annualEntitlement,
      isAccrualBased: data.isAccrualBased,
      accrualRatePerMonth: data.accrualRatePerMonth,
      maxCarryOverDays: data.maxCarryOverDays,
      allowNegativeBalance: data.allowNegativeBalance,
      createdAt: data.createdAt,
    });
  }
  showEdit(index: number) {
    this.editIndex = index;
  }
  onSubmit() {
    console.log('form value: ', this.leavePolicyForm.value);
  }
  toggleForm() {
    this.showForm = !this.showForm;
    // this.resetForm(); // optional: reset form when opening
  }
  resetForm() {
    this.leavePolicyForm.reset();
  }
  getEmploymentTypes() {
    this.employmentTypeService
      .getEmploymentTypes()
      .subscribe((employmentTypes) => {
        this.employmentTypes = employmentTypes.data;
        console.log('Employment types: ', this.employmentTypes);
      });
  }
  getLeaveTypes() {
    this.leaveTypeService.getLeaveTypes().subscribe((res) => {
      this.leaveTypes = res.data;
      console.log('Leave Types: ', res);
    });
  }
}
