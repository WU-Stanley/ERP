import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FlatButtonComponent,
  CustomSelectComponent,
  SubmitRoundedButtonComponent,
  CustomInputComponent,
  CustomCheckboxComponent,
  AlertService,
} from '@erp/core';
import { LeavePolicyDto } from '../../../dtos/leave.dto';
import { CommonModule } from '@angular/common';
import {
  EmploymentTypeStore,
  LeavePolicyStore,
  LeaveTypeStore,
} from '../../../state';

@Component({
  selector: 'lib-leave-policy-form',
  templateUrl: './leave-policy-form.component.html',
  styleUrls: ['./leave-policy-form.component.scss'],
  imports: [
    FlatButtonComponent,
    CustomSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    SubmitRoundedButtonComponent,
    CommonModule,
    CustomInputComponent,
    CustomCheckboxComponent,
  ],
})
export class LeavePolicyFormComponent implements OnInit {
  leavePolicyForm!: FormGroup;
  editIndex: number | null = null;
  showForm = false;
  leaveTypeStore = inject(LeaveTypeStore);
  employmentTypeStore = inject(EmploymentTypeStore);

  selectedLeaveType = computed(() => this.leaveTypeStore.selectedLeaveType());
  // isEditing = computed(() => this.leaveTypeStore.isEditing());
  // isLoading = computed(() => this.leaveTypeStore.isLoading());
  leaveTypes = computed(() => this.leaveTypeStore.leaveTypes());

  employmentTypes = computed(() => this.employmentTypeStore.employmentTypes());
  // isLoading = computed(() => this.employmentTypeStore.isLoading());
  selectedEmploymentType = computed(() =>
    this.employmentTypeStore.selectedEmploymentType()
  );

  leavePolicyStore = inject(LeavePolicyStore);
  selectedLeavePolicy = computed(() =>
    this.leavePolicyStore.selectedLeavePolicy()
  );
  isEditing = computed(() => this.leavePolicyStore.isEditing());
  isLoading = computed(() => this.leavePolicyStore.isLoading());
  leavePolicys = computed(() => this.leavePolicyStore.leavePolicys());

  @Output() emitTogglePolicyForm: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  isAccrualBased = false;
  @Input() readonly = false;
  constructor(private fb: FormBuilder, private alertService: AlertService) {}

  ngOnInit() {
    if (!this.employmentTypes().length) {
      this.employmentTypeStore.getAllEmploymentTypes();
    }
    if (!this.leaveTypes().length) {
      this.leaveTypeStore.getAllLeaveTypes();
    }
    this.leavePolicyForm = this.fb.group({
      leaveTypeId: ['', Validators.required],
      employmentTypeId: ['', Validators.required], // e.g., "FullTime", "Contract"
      roleName: [''], // Optional
      annualEntitlement: [20, [Validators.required, Validators.min(0)]],
      isAccrualBased: [false],
      maxDaysPerRequest: [20, [Validators.required, Validators.min(0)]],
      maxCarryOverDays: [0, [Validators.min(0)]],
      allowNegativeBalance: [false],
      allowBackdatedRequest: [false],
      includePublicHolidays: [true],
    });
    if (this.selectedLeaveType()) {
      this.leavePolicyForm.patchValue({
        leaveTypeId: this.selectedLeaveType()?.id,
      });

      console.log('Selected Leave Type: ', this.selectedLeaveType());
    }
    setTimeout(() => {
      console.log('isEditing mode: ', this.isEditing());
      if (this.isEditing()) {
        console.log('is edit mode:', this.selectedLeavePolicy());
        this.edit(this.selectedLeavePolicy() as LeavePolicyDto);
      }
    }, 1000);
    this.leavePolicyForm
      .get('isAccrualBased')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.isAccrualBased = true;
          this.leavePolicyForm.addControl(
            'accrualRatePerMonth',
            this.fb.control(1.6, [Validators.min(0)])
          );
        } else {
          this.isAccrualBased = false;
          this.leavePolicyForm.removeControl('accrualRatePerMonth');
        }
      });
  }
  edit(data: LeavePolicyDto) {
    console.log('Editing Leave Policy: ', data);
    this.leavePolicyForm.patchValue({
      leaveTypeId: data.leaveTypeId,
      employmentTypeId: data.employmentType, // e.g., "FullTime", "Contract"
      roleName: data.roleName,
      annualEntitlement: data.annualEntitlement,
      isAccrualBased: data.isAccrualBased,
      maxCarryOverDays: data.maxCarryOverDays,
      allowNegativeBalance: data.allowNegativeBalance,
      createdAt: data.createdAt,
    });
    if (data.isAccrualBased) {
      this.leavePolicyForm.addControl(
        'accrualRatePerMonth',
        this.fb.control(data.accrualRatePerMonth, [Validators.min(0)])
      );
    }
  }
  showEdit(index: number) {
    this.editIndex = index;
  }
  onSubmit() {
    console.log('form value: ', this.leavePolicyForm.value);
    this.leavePolicyStore.addLeavePolicy(this.leavePolicyForm.value);
    if (!this.isLoading()) {
      this.resetForm();
      this.toggleForm();
      this.alertService.showSuccess('Leave Policy created successfully');
    }
  }
  toggleForm() {
    this.emitTogglePolicyForm.emit(true);
    this.leavePolicyStore.toggleEditing();
  }
  resetForm() {
    this.leavePolicyForm.reset();
  }
}
