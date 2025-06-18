import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CancelButtonComponent, CustomInputComponent, SubmitButtonComponent } from '@erp/core';
import { AuthDashboardComponent } from '../auth-dashboard/auth-dashboard.component';

@Component({
  selector: 'lib-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports:[CustomInputComponent,SubmitButtonComponent,AuthDashboardComponent,ReactiveFormsModule,CommonModule,CancelButtonComponent]
})
export class ChangePasswordComponent implements OnInit {
changePasswordForm!: FormGroup;


  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.changePasswordForm =this.fb.group({
      oldPassword:['',[Validators.required,]],
      newPassword:['',[Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')]],
      confirmPassword:['',[Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')]]
    })
  }
requestResetToken() {
throw new Error('Method not implemented.');
} passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
