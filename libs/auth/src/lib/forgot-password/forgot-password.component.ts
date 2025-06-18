import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomInputComponent, SubmitButtonComponent } from '@erp/core'; // Adjust the import path as necessary

@Component({
  selector: 'lib-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [
    SubmitButtonComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class ForgotPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  tokenForm!: FormGroup;
  step = 0;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.tokenForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group({
      token: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator]],
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  requestResetToken() {
    console.log('form value: ', this.tokenForm.value);
    this.step = 1;
  }
}
