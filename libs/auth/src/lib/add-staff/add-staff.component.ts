import { Component, OnInit } from '@angular/core';
import {
  CustomInputComponent,
  CustomSelectComponent,
  SubmitRoundedButtonComponent,
} from '@erp/core';
import { RoleService } from '../role.service';
import { DepartmentService } from '../department.service';
import { RoleDto } from '../dtos/role.dto';
import { DepartmentDto } from '../dtos/department.dto';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserTypeDto } from '../dtos/usertype.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css'],
  imports: [
    CustomInputComponent,
    SubmitRoundedButtonComponent,
    CustomSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
})
export class AddStaffComponent implements OnInit {
  roles: RoleDto[] = [];
  departments: DepartmentDto[] = [];
  userForm!: FormGroup;
  userTypes: UserTypeDto[] = [];
  employmentTypes: any[] = [];
  isProcessing = false;

  constructor(
    private roleService: RoleService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private sb: MatSnackBar
  ) {}

  ngOnInit() {
    // this.getRoles();
    this.getDepartments();
    this.getUserTypes();
    this.getEmploymentTypes();
    
    this.userForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      userName: [''],
      userTypeId: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      dateCreated: [new Date()],
      password: ['', [Validators.required]],
      employmentTypeId: ['', [Validators.required]],
    });

    this.userForm.get('firstName')?.valueChanges.subscribe(() => {
      this.updateFullName();
    });
    this.userForm.get('lastName')?.valueChanges.subscribe(() => {
      this.updateFullName();
    });
    this.userForm.valueChanges.subscribe((val) => {
      // console.log('Form changed:', val);
    });
  }
  getEmploymentTypes() {
    this.authService.getEmploymentTypes().subscribe((employmentTypes) => {
      console.log('employment types: ', employmentTypes);
      if(employmentTypes.data?.length) {
        this.employmentTypes = employmentTypes.data;
      }
      console.log('employment types: ', this.employmentTypes);
    });
  }
  getRoles() {
    this.roleService.getRoles().subscribe((roles) => {
      console.log('found roles: ', roles);
      this.roles = roles.data??[];
    },((error) => {
      console.error('Error fetching roles:', error);
    }));
  }
  getDepartments() {
    this.departmentService.getDepartments().subscribe((depts) => {
      console.log('depts: ', depts);
      this.departments = depts;
    });
  }
  getUserTypes() {
    this.authService.getUserTypes().subscribe((userTypes) => {
      console.log('user types: ', userTypes);
      this.userTypes = userTypes.data;
    });
  } private updateFullName() {
    const firstName = this.userForm.get('firstName')?.value || '';
    const lastName = this.userForm.get('lastName')?.value || '';
    const fullName = `${firstName} ${lastName}`.trim();
    this.userForm.get('fullName')?.setValue(fullName); 
  }
  onSubmit() {
    this.isProcessing = true;
     const value = this.userForm.value;

    value.userName = value.fullName;
    value.dateCreated = value.dateCreated ??new Date();
   
    value.password = (Math.random() * 10).toString(32).substring(0, 10);

    this.authService.addStaff(value).subscribe(
      (res) => {
        this.isProcessing = false;
        console.log('add user res: ', res);
        this.sb.open('Staff User Profile created successfully!', 'X', {
          duration: 3000,
        });
        this.userForm.reset();
      },
      (error) => {
        console.log('Error occured: ', error);
        this.sb.open('Error occured!', 'X', { duration: 3000 });
        this.isProcessing = false;
      }
    );
  }
}