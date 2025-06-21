import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CustomInputComponent, SubmitRoundedButtonComponent } from '@erp/core';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomInputComponent,
    SubmitRoundedButtonComponent,
    MatSnackBarModule,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  errorMessage = '';
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  user = JSON.parse(localStorage.getItem('user') || 'null');
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sb: MatSnackBar
  ) {}

  ngOnInit() {
    this.changePasswordForm = this.fb.group(
      {
        email: [''],
        oldPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;"\'<>,.?/~`|\\\\])[A-Za-z\\d!@#$%^&*()_+\\-={}\\[\\]:;"\'<>,.?/~`|\\\\]{6,}$'
            ),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;"\'<>,.?/~`|\\\\])[A-Za-z\\d!@#$%^&*()_+\\-={}\\[\\]:;"\'<>,.?/~`|\\\\]{6,}$'
            ),
          ],
        ],
      },
      { validators: this.passwordMatchValidator }
    );

    this.changePasswordForm.valueChanges.subscribe(() => {
      const matched = this.passwordMatchValidator(this.changePasswordForm);
      if (matched?.passwordMismatch) {
        this.errorMessage = 'Password and confirm password does not match';
      } else {
        this.errorMessage = '';
      }
    });
  }

  passwordMatchValidator = (
    group: AbstractControl
  ): null | { passwordMismatch: true } => {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  };

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.changePasswordForm.patchValue({
        email: this.user.userEmail,
      });
      const json = this.changePasswordForm.value;
      this.authService.changePassword(json).subscribe((res) => {
        console.log('Change password response: ', res);
        this.user.isDefault =false;
        localStorage.setItem('user',JSON.stringify(this.user));
        this.sb.open('Your password has been changed successfully!', 'X', {
          duration: 3000,
          panelClass: ['custom-snackbar-success'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },error=>{
        console.log('Error: ',error)
        if(error.status ==400){
          this.sb.open(error.error,'X',{duration:3000})
        }
      });
    }
  }
  revealPassword(
    event: Event,
    field: 'oldPassword' | 'newPassword' | 'confirmPassword'
  ) {
    if (field === 'oldPassword') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
