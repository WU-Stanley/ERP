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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
    this.signInForm.valueChanges.subscribe((val) =>
      console.log('form changed:', val)
    );
    
  }

  submitForm() {
    console.log('value', this.signInForm.value);
    // if (this.signInForm.valid) {
    //   console.log('Form submitted:', this.signInForm.value);
    //     // Handle form submission logic here
    //   } else {
    //     console.log('Form is invalid');
    //     // Handle form validation errors here
    //   }
  }
  navigateToSignUp() {
    console.log('Navigating to sign up page');
    // Implement navigation logic here, e.g., using a router service
  }
  navigateToForgotPassword() {
    console.log('Navigating to forgot password page');
    // Implement navigation logic here, e.g., using a router service
  }
}
