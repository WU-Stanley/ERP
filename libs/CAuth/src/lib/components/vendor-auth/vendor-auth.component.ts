import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  CustomInputComponent,
  SubmitButtonComponent,
  SubmitRoundedButtonComponent,
} from '@erp/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'lib-vendor-auth',
  templateUrl: './vendor-auth.component.html',
  styleUrls: ['./vendor-auth.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    SubmitRoundedButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  standalone: true,
})
export class VendorAuthComponent {
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
    this.authService.vendorLogin(this.loginForm.value).subscribe(
      (res) => {
        console.log('vendor login response: ', res);
        localStorage.setItem('token', res.token || '');
        localStorage.setItem('WUName', res.username || '');
        this.router.navigate(['/vendor/dashboard']);
        localStorage.setItem('WUVendorId', res.vendorId || '');
      },
      (error) => {
        console.log('Error in login: ', error);
        this.loading = false;
      }
    );
  }
}
