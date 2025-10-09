import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomInputComponent, SubmitButtonComponent } from '@erp/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [
    CustomInputComponent,
    SubmitButtonComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ResetPasswordComponent implements OnInit {
  isProcessing = false;
  resetForm!: FormGroup;
  email: any;
  showPassword = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
    });

    this.resetForm = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      resetToken: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmedPassword: [
        '',
        [Validators.required, this.passwordMatchValidator],
      ],
    });
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmedPassword = formGroup.get('confirmedPassword')?.value;
    return newPassword === confirmedPassword
      ? null
      : { passwordMismatch: true };
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  resetPassword() {
    const emailFromStorage = localStorage.getItem('resetEmail');
    this.email = this.email ? this.email : emailFromStorage;
    if (this.resetForm.valid) {
      console.log(
        'Reset form value: ',
        this.resetForm.value,
        ' email: ',
        this.email
      );
      this.isProcessing = true;
      this.authService
        .resetPassword({
          ...this.resetForm.value,
          email: this.email,
        })
        .subscribe({
          next: (response) => {
            console.log('Response: ', response);
            // if (response.status) {
            this.router.navigate(['/auth/login']);
            // }
            this.isProcessing = false;
          },
          error: (error) => {
            this.isProcessing = false;
            console.error('Error: ', error);
          },
        });
    }
  }
}
