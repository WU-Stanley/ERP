import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventEmitter } from '@angular/core';
import {
  CustomInputComponent,
  CustomTextareaComponent,
  CustomSelectComponent,
  CancelButtonComponent,
  SubmitRoundedButtonComponent,
  CustomToggleComponent,
  CustomCheckboxComponent,
  CustomRadioComponent,
  CustomSliderComponent,
  CustomSlideToggleComponent,
  CustomRadioGroupComponent,
  AddButtonComponent,
  FlatButtonComponent,
  DisableContainerDirective,
} from '@erp/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  DepartmentService,
  RoleService,
  RoleDto,
  UserTypeDto,
  DepartmentDto,
  VisibilityTypes,
  EmploymentTypeDto,
  UserTypeService,
  HasAnyPermissionDirective,
  Permissions,
} from '@erp/auth';
import { forkJoin } from 'rxjs';
import { ApprovalWorkflowService } from '../../../services/approval-workflow.service';
import { CreateApprovalFlowDto, LeaveTypeDto } from '../../../dtos/leave.dto';
import { LeaveTypeService } from '../../../services/leave-type.service';
import { LeaveTypeStore } from '../../../state';
import { EmploymentTypeService } from '../../../services/employment-type.service';
@Component({
  selector: 'lib-leave-type-form',
  templateUrl: './leave-type-form.component.html',
  styleUrls: ['./leave-type-form.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    CustomInputComponent,
    CustomTextareaComponent,
    CustomSelectComponent,
    CancelButtonComponent,
    SubmitRoundedButtonComponent,
    FlatButtonComponent,
    CancelButtonComponent,
    CustomCheckboxComponent,
    AddButtonComponent,
    HasAnyPermissionDirective,
  ],
  // providers: [LeaveTypeStore],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LeaveTypeFormComponent implements OnInit {
  leaveTypeStore = inject(LeaveTypeStore);
  authService = inject(AuthService);
  selectedLeaveType = computed(() => this.leaveTypeStore.selectedLeaveType());
  isEditing = computed(() => this.leaveTypeStore.isEditing());
  isLoading = computed(() => this.leaveTypeStore.isLoading());

  visibilityTypes = [
    { label: 'ROLE', id: 'ROLE' },
    { label: 'DEPARTMENT', id: 'DEPARTMENT' },
    { label: 'USER TYPE', id: 'USER_TYPE' },
    { label: 'EMPLOYMENT TYPE', id: 'EMPLOYMENT_TYPE' },
  ];

  leaveTypeForm!: FormGroup;
  @Output() emitToggleForm: EventEmitter<boolean> = new EventEmitter();
  @Input() toggleStatus!: boolean;

  genders = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'other', label: 'Other' },
  ];

  userTypes: UserTypeDto[] = [];
  departments: DepartmentDto[] = [];
  roles: RoleDto[] = [];
  employmentTypes: EmploymentTypeDto[] = [];
  approvalWorkflows: CreateApprovalFlowDto[] = [];
  isProcessing = false;
  @Input() readonly = false;
  hrAdminPermissions: string[] = [Permissions.ManageLeave];
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private departmentService: DepartmentService,
    private userTypeService: UserTypeService,
    private employmentTypeService: EmploymentTypeService,
    private approvalWorkflowService: ApprovalWorkflowService,
    private leaveTypeService: LeaveTypeService
  ) {}

  ngOnInit() {
    console.log('selected leave type: ', this.selectedLeaveType());
    this.leaveTypeForm = this.fb.group({
      gender: [''],
      name: ['', [Validators.required]], // e.g., "Annual Leave"
      maxDays: [20, [Validators.required]],
      isPaid: [true, [Validators.required]],
      description: [''],
      isActive: [true, [Validators.required]],
      requireDocument: [false, [Validators.required]],
      approvalFlowId: [''],
      colorTag: [''],
      visibilityRules: this.fb.array([]),
      id: [''],
      // policy
      // maxCarryOverDays: [''],
      // allowNegativeBalance: [false],
      // includePublicHolidays: [true],
      // allowBackdatedRequest: [false],
      maxDaysPerRequest: [10],
    });

    const userTypes$ = this.userTypeService.getUserTypes();
    const roles$ = this.roleService.getRoles();
    const departments$ = this.departmentService.getDepartments();
    const employmentTypes$ = this.employmentTypeService.getEmploymentTypes();
    const approvalWorkflows$ =
      this.approvalWorkflowService.getApprovalWorkflows();

    forkJoin([
      userTypes$,
      roles$,
      departments$,
      employmentTypes$,
      approvalWorkflows$,
    ]).subscribe({
      next: ([
        userTypes,
        roles,
        departments,
        employmentTypes,
        approvalWorkflows,
      ]) => {
        console.log('UserTypes:', userTypes);
        console.log('Roles:', roles);
        console.log('Permissions:', departments);
        console.log('approval flows: ', approvalWorkflows);
        this.userTypes = userTypes.data ?? [];
        this.departments = departments.data ?? [];
        this.roles = roles.data ?? [];
        this.employmentTypes = employmentTypes.data ?? [];
        this.approvalWorkflows = approvalWorkflows.data ?? [];

        this.leaveTypeForm.get('approvalFlowId')?.markAsTouched();
      },
      error: (err) => console.error('Error fetching data:', err),
    });
    setTimeout(() => {
      if (this.selectedLeaveType()) {
        this.leaveTypeForm.patchValue(this.selectedLeaveType() as LeaveTypeDto);

        this.selectedLeaveType()?.visibilityRules.forEach((rule) => {
          console.log('visibility rule: ', rule);
          this.visibilityRules.push(
            this.fb.group({
              visibilityType: [rule.visibilityType, [Validators.required]],
              value: [rule.value, [Validators.required]],
            })
          );
        });
      }
      // if (this.isEditing()) {
      //   this.leaveTypeForm.get('approvalFlowId')?.updateValueAndValidity();
      // }
    }, 1000);
  }

  get visibilityRules() {
    return this.leaveTypeForm.get('visibilityRules') as FormArray;
  }
  addVisibility() {
    this.visibilityRules.push(
      this.fb.group({
        visibilityType: [''],
        value: [''],
      })
    );
  }
  removeRule(index: number) {
    this.visibilityRules.removeAt(index);
  }
  getOptions(i: number) {
    setTimeout(() => {
      this.visibilityRules.at(i)?.get('value')?.markAllAsTouched();
    }, 2000);
    const visibilityType = this.visibilityRules
      .at(i)
      .get('visibilityType')?.value;
    console.log('visibility type: ', visibilityType);
    if (visibilityType == VisibilityTypes.ROLE) {
      return this.roles;
    } else if (visibilityType == VisibilityTypes.DEPARTMENT) {
      return this.departments;
    } else if (visibilityType === VisibilityTypes['EMPLOYMENT TYPE']) {
      return this.employmentTypes;
    } else if (visibilityType == VisibilityTypes['USER TYPE']) {
      console.log('user types: ', this.userTypes);
      return this.userTypes;
    }
    return [];
  }
  cancel() {
    this.toggleForm();
    this.leaveTypeForm.reset();
  }
  toggleForm() {
    this.emitToggleForm.emit(true);
  }
  submit() {
    const value = this.leaveTypeForm.value;
    console.log('form value: ', value);

    const visibilityRules = value.visibilityRules.flatMap((rule: any) => {
      if (Array.isArray(rule.value) && rule.value.length > 1) {
        return rule.value.map((v: string) => ({
          visibilityType: rule.visibilityType,
          value: v,
        }));
      }
      return [
        {
          visibilityType: rule.visibilityType,
          value: Array.isArray(rule.value) ? rule.value[0] : rule.value,
        },
      ];
    });
    value.visibilityRules = visibilityRules;

    if (this.isEditing()) {
      this.leaveTypeStore.updateLeaveType(value);
      if (!this.isLoading()) {
        this.cancel();
      }
    } else {
      this.leaveTypeStore.createLeaveType(value);
      this.leaveTypeStore.updateLeaveType(value);
      if (!this.isLoading()) {
        this.cancel();
      }
      // this.leaveTypeService.createLeaveType(value).subscribe(
      //   (res) => {
      //     console.log('Leave type created: ', res);
      //     this.isProcessing = false;
      //     this.cancel();
      //     // add leave type to the state
      //     this.leaveTypeStore.addLeaveType(res.data as LeaveTypeDto);
      //   },
      //   (error) => {
      //     this.isProcessing = false;
      //     console.log('Error: ', error);
      //   }
      // );
    }
  }
}
