import { Component, OnInit } from '@angular/core';
import {
  SubmitRoundedButtonComponent,
  CustomTextareaComponent,
  CustomInputComponent,
  FlatButtonComponent,
  CustomSelectComponent,
} from '@erp/core';
import { DepartmentDto } from '../dtos/department.dto';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { DepartmentService } from '../department.service';
import { CommonModule } from '@angular/common';
import { UserDto } from '../dtos/usertype.dto';

@Component({
  selector: 'lib-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  imports: [
    SubmitRoundedButtonComponent,
    CustomTextareaComponent,
    CustomInputComponent,
    FlatButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    CustomSelectComponent,
  ],
})
export class DepartmentComponent implements OnInit {
  departmentForm!: FormGroup;

  searchTerm = '';
  isProcessing = false;
  isDialogOpen = false;
  departments: DepartmentDto[] = [];
  users!: UserDto[];
  editingDepartmentId: string | null = null;
  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.departmentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      headOfDepartmentId: new FormControl(''),
    });
    this.authService.getAllStaff().subscribe((staffs) => {
      this.users = (staffs.data ?? []).filter((staff) => !!staff.employeeId);
    });
  }
  editDepartment(department: DepartmentDto) {
    this.editingDepartmentId = department.id;
    this.departmentForm.patchValue({
      name: department.name,
      description: department.description,
      headOfDepartmentId: department.headOfDepartmentId ?? '',
    });
    this.openDialog();
  }
  openDialog() {
    this.isDialogOpen = true;
  }
  onAddDepartment() {
    if (this.departmentForm.invalid) return;
    this.isProcessing = true;
    const { headOfDepartmentId, ...formValue } = this.departmentForm.value;
    const payload = {
      ...formValue,
      ...(headOfDepartmentId ? { headOfDepartmentId } : {}),
    };

    const request$ = this.editingDepartmentId
      ? this.departmentService.updateDepartment({ ...payload, id: this.editingDepartmentId })
      : this.departmentService.createDepartment(payload);

    request$.subscribe({
        next: (res) => {
          console.log(this.editingDepartmentId ? 'updated department: ' : 'new department: ', res);
          this.isProcessing = false;
          this.isDialogOpen = false;
          this.editingDepartmentId = null;
          this.departmentForm.reset();
          this.loadDepartments();
        },
        error: (error) => {
          console.error('department save failed:', error);
          this.isProcessing = false;
        },
      });
  }

  handleDialogClose(data: any | null) {
    this.isDialogOpen = false;
    this.editingDepartmentId = null;
    if (data) {
      console.log('department Created:', data);
      this.loadDepartments();
    }
    this.departmentForm.reset();
  }
  get filteredDepartments() {
    const term = this.searchTerm.toLowerCase();
    return this.departments?.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term)
    );
  }
  loadDepartments() {
    this.departmentService.getDepartments().subscribe((departments) => {
      this.departments = departments.data || [];
      console.log('loaded departments: ', departments);
    });
  }
}
