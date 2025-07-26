import { Component, OnInit } from '@angular/core';
import {
  SubmitRoundedButtonComponent,
  CustomTextareaComponent,
  CustomInputComponent,
  FlatButtonComponent,
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
  ],
})
export class DepartmentComponent implements OnInit {
  departmentForm!: FormGroup;
 
  searchTerm = '';
  isProcessing = false;
  isDialogOpen = false; 
  departments: DepartmentDto[] = [];
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
    });
  }
  openDialog() {
    this.isDialogOpen = true;
  }
  onAddDepartment() {
    if (this.departmentForm.invalid) return;
    this.isProcessing = true;
    this.departmentService
      .createDepartment(this.departmentForm.value)
      .subscribe((res) => {
        console.log('new department: ', res);
        this.isProcessing = false;
        this.isDialogOpen = false;
        this.loadDepartments();
      });
  }

  handleDialogClose(data: any | null) {
    this.isDialogOpen = false;
    if (data) {
      console.log('Role Created:', data);
      this.loadDepartments();
    }
  }
  get filteredDepartments() {
    const term = this.searchTerm.toLowerCase();
    return this.departments?.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }
  loadDepartments() {
    this.departmentService.getDepartments().subscribe((departments) => {
      this.departments = departments || [];
      console.log('loaded departments: ',departments)
    });
  }
}
