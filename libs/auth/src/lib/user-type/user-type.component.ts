import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  CustomInputComponent,
  CustomTextareaComponent,
  FlatButtonComponent,
  SubmitRoundedButtonComponent,
} from '@erp/core';
import { UserTypeDto } from '../dtos/usertype.dto';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.css'],
  imports: [
    CustomInputComponent,
    CustomTextareaComponent,
    FlatButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    FlatButtonComponent,
    RouterModule,
    CommonModule,
    SubmitRoundedButtonComponent,
  ],
})
export class UserTypeComponent implements OnInit {
  userTypes: UserTypeDto[] = [];
  searchTerm = '';
  isProcessing = false;
  isDialogOpen = false;
  userTypeForm!: FormGroup<any>;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadUserTypes();
    this.userTypeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }
  openDialog() {
    this.isDialogOpen = true;
  }
  onAddUserType() {
    if (this.userTypeForm.invalid) return;
    this.isProcessing = true;
    this.authService.addUserType(this.userTypeForm.value).subscribe((res) => {
      console.log('new user type: ', res);
      this.isProcessing = false;
      this.isDialogOpen = false;
      this.loadUserTypes();
    });
  }

  handleDialogClose(data: any | null) {
    this.isDialogOpen = false;
    if (data) {
      console.log('Role Created:', data);
      this.loadUserTypes();
    }
  }
  get filteredUserTypes() {
    const term = this.searchTerm.toLowerCase();
    return this.userTypes?.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }
  loadUserTypes() {
    this.authService.getUserTypes().subscribe((userTypes) => {
      this.userTypes = userTypes.data || [];
    });
  }
}
