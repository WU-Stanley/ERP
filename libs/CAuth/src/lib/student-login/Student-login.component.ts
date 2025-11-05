import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CustomInputComponent, SubmitButtonComponent } from '@erp/core';
@Component({
  selector: 'lib-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    SubmitButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  standalone: true,
})
export class StudentLoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  showPassword = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]], // JAMB No or Email
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate API authentication
    setTimeout(() => {
      this.loading = false;
      alert('Login successful! Redirecting...');
      this.router.navigate(['/student-dashboard']);
    }, 1500);
  }
}
