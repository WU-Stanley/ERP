import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomInputComponent, SubmitButtonComponent } from '@erp/core'; // Adjust the import path as necessary
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [
    SubmitButtonComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ForgotPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  tokenForm!: FormGroup;
  step = 0;
  isProcessing = false;
  email: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.tokenForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  requestResetToken() {
    if (this.tokenForm.valid) {
      this.email = this.tokenForm.value.email;
      console.log('email: ', this.email);
      console.log('form value: ', this.tokenForm.value);
      this.isProcessing = true;
      this.authService.forgotPassword(this.tokenForm.value).subscribe({
        next: (response) => {
          console.log('Response: ', response);
          if (response.status) {
            localStorage.setItem('resetEmail', this.email);
            this.router.navigate(['/auth/reset-password'], {
              queryParams: { email: this.email },
            });
          }
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
