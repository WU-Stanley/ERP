import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { EmploymentTypeDto } from '../dtos/usertype.dto';
import {
  SubmitRoundedButtonComponent,
  CustomInputComponent,
  FlatButtonComponent,
  CustomTextareaComponent,
} from '@erp/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'lib-employment-type',
  templateUrl: './employment-type.component.html',
  styleUrls: ['./employment-type.component.css'],
  imports: [
    SubmitRoundedButtonComponent,
    CustomInputComponent,
    FlatButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    CustomTextareaComponent,
    CommonModule,
    RouterModule,
  ],
})
export class EmploymentTypeComponent implements OnInit {
  userTypes: EmploymentTypeDto[] = [];
  searchTerm = '';
  isProcessing = false;
  isDialogOpen = false;
  empTypeForm!: FormGroup<any>;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadEmploymentTypes();
    this.empTypeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }
  openDialog() {
    this.isDialogOpen = true;
  }
  onAddEmploymentType() {
    if (this.empTypeForm.invalid) return;
    this.isProcessing = true;
    this.authService
      .addEmploymentType(this.empTypeForm.value)
      .subscribe((res) => {
        console.log('new employment type: ', res);
        this.isProcessing = false;
        this.isDialogOpen = false;
        this.loadEmploymentTypes();
      });
  }

  handleDialogClose(data: any | null) {
    this.isDialogOpen = false;
    if (data) {
      console.log('Role Created:', data);
      this.loadEmploymentTypes();
    }
  }
  get filteredEmploymentTypes() {
    const term = this.searchTerm.toLowerCase();
    return this.userTypes?.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }
  loadEmploymentTypes() {
    this.authService.getEmploymentTypes().subscribe((employmentTypes) => {
      this.userTypes = employmentTypes.data || [];
    });
  }
}
