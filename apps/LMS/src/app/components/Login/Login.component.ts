import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { LmsAuthService } from '../../services/lms-auth.service';

@Component({
  selector: 'lms-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './Login.component.html',
  styleUrl: './Login.component.scss',
  standalone: true,
})
export class LoginComponent {
  protected readonly loginForm;
  protected isSubmitting = false;
  protected authError: string | null = null;
  protected authSuccess: string | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: LmsAuthService
  ) {
    this.loginForm = this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  protected onEmailPasswordLogin(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.authError = null;
    this.authSuccess = null;

    const credentials = this.loginForm.getRawValue();
    this.authService
      .loginWithEmail(credentials)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response) => {
          this.authService.setSession(response);
          this.authSuccess = 'Signed in successfully.';
        },
        error: (error: { error?: { message?: string } }) => {
          this.authError = error.error?.message ?? 'Login failed. Please try again.';
        },
      });
  }

  protected onMicrosoftLogin(): void {
    this.authService.startMicrosoftLogin();
  }

  protected hasError(controlName: 'email' | 'password', errorName: string): boolean {
    const control = this.loginForm.controls[controlName];
    return control.touched && control.hasError(errorName);
  }
}
