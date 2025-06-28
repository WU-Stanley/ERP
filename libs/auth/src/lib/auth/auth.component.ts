import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CustomInputComponent,
  SubmitRoundedButtonComponent,
  CancelRoundedButtonComponent,
  CancelButtonComponent,
  FlatButtonComponent,
} from '@erp/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-auth',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CustomInputComponent,
    SubmitRoundedButtonComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  disabled = true;
  signInForm!: FormGroup;
  verifyForm!: FormGroup;
  res: any;
  showPassword = false;
  isProcessing = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    (() => {
      const token = localStorage.getItem('token');
      if (token) {
        this.router.navigate(['/auth/dashboard']);
      }
    })();
    this.verifyForm = this.formBuilder.group({
      token: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
    });
    this.signInForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  submitForm() {
    this.isProcessing = true;
    console.log('value', this.signInForm.value);
    const value = this.signInForm.value;
    value.password = value.password.trim();
    value.email = value.email.trim();
    this.authService.login(value).subscribe(
      (res) => {
        console.log('Login Response: ', res);
        this.res = res;
        this.isProcessing = false;
        if (!res.data?.data.twoFactorEnabled) {
          this.authService.setEnv(res);
          this.router.navigate(['auth/dashboard']);
        }
      },
      (error) => {
        this.isProcessing = false;
      }
    );
  }
  verifyToken() {
    this.isProcessing = true;
    this.verifyForm.patchValue({
      email: this.signInForm.get('email')?.value,
    });
    console.log('verify form: ', this.verifyForm.value);
    this.authService.verifyLoginToken(this.verifyForm.value).subscribe(
      (tokenRes) => {
        this.isProcessing = false;
        console.log('token response: ', tokenRes);
        this.authService.setEnv(tokenRes);
        // this.authService.refToken.set(this.res.refreshToken)
        // this.authService.tokenExpires.set(15);
        if (this.res.data.isDefault) {
          this.router.navigate(['auth/change-password']);
        } else {
          this.router.navigate(['auth/dashboard']);
        }
      },
      (error) => {
        this.isProcessing = false;
      }
    );
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  navigateToForgotPassword() {
    console.log('Navigating to forgot password page');
    // Implement navigation logic here, e.g., using a router service
  }
}
