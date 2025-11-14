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

import {
  CustomInputComponent,
  SubmitButtonComponent,
  SubmitRoundedButtonComponent,
} from '@erp/core';
import { AuthService } from '../auth.service';
@Component({
  selector: 'lib-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    SubmitButtonComponent,
    SubmitRoundedButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  standalone: true,
})
export class StudentLoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]], // JAMB No or Email
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
    this.authService.loginStudent(this.loginForm.value).subscribe(
      (res) => {
        console.log('student login response: ', res);
        localStorage.setItem('token', res.token || '');
        localStorage.setItem('WUName', res.username || '');
        this.router.navigate(['/student/dashboard/menu']);
      },
      (error) => {
        console.log('Error in login: ', error);
        this.loading = false;
      }
    );
  }
}
