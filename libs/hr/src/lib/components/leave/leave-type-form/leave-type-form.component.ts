import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
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
} from '@erp/auth';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'lib-leave-type-form',
  templateUrl: './leave-type-form.component.html',
  styleUrls: ['./leave-type-form.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    CustomToggleComponent,
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
    CustomRadioComponent,
    CustomSliderComponent,
    CustomRadioGroupComponent,
    CustomSlideToggleComponent,
    AddButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LeaveTypeFormComponent implements OnInit {
  visibilityTypes = [
    { label: 'ROLE', id: 'ROLE' },
    { label: 'DEPARTMENT', id: 'DEPARTMENT' },
    { label: 'USER TYPE', id: 'USER_TYPE' },
    { label: 'EMPLOYMENT TYPE', id: 'EMPLOYMENT_TYPE' },
  ];

  leaveTypeForm!: FormGroup;
  @Output() emitToggleForm: EventEmitter<boolean> = new EventEmitter();
  @Input() toggleStatus!: boolean;
  backDateEnabled: any;
  selected: any;

  genders = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'other', label: 'Other' },
  ];

  selectedCountries: any;
  userTypes: UserTypeDto[] = [];
  departments: DepartmentDto[] = [];
  roles: RoleDto[] = [];
  employmentTypes: EmploymentTypeDto[] = [];
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private departmentService: DepartmentService,
    private userTypeService: AuthService
  ) {}

  ngOnInit() {
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
      // policy
      maxCarryOverDays: [''],
      allowNegativeBalance: [false],
      includePublicHolidays: [true],
      allowBackdatedRequest: [false],
      maxDaysPerRequest: [10],
    });
    this.leaveTypeForm.valueChanges.subscribe((value) => {
      console.log('form changes: ', value);
    });

    const userTypes$ = this.userTypeService.getUserTypes();
    const roles$ = this.roleService.getRoles();
    const departments$ = this.departmentService.getDepartments();
    const employmentTypes$ = this.userTypeService.getEmploymentTypes();

    forkJoin([userTypes$, roles$, departments$, employmentTypes$]).subscribe({
      next: ([userTypes, roles, departments, employmentTypes]) => {
        console.log('Users:', userTypes);
        console.log('Roles:', roles);
        console.log('Permissions:', departments);
        this.userTypes = userTypes.data ?? [];
        this.departments = departments ?? [];
        this.roles = roles.data ?? [];
        this.employmentTypes = employmentTypes.data ?? [];
      },
      error: (err) => console.error('Error fetching data:', err),
    });
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
      return this.userTypes;
    }
    return [];
  }
  cancel(){
    this.toggleForm();
    this.leaveTypeForm.reset();
  }
  toggleForm() {
    this.emitToggleForm.emit(true);
  }
  submit(){
    const value = this.leaveTypeForm.value;
    const policyForm = {

    }
    const leaveForm={
      gender:value.gender,
      name:value.name,
      maxDays:value.maxDay,
      isPaid: value.isPaid,
      isActive:value.isActive,
      colorTag: value.colorTag,
    }
  }
}
