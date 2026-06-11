import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 

@Component({
  selector: 'lib-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
})
export class TextFieldComponent {
  focused = false;
  @Input() disabled = false;
  @Input() label = 'Label';
  @Input() placeholder = 'Confirm new password';
  @Input() type = 'text';
  @Input() controlName = '';
  @Input() inputControl!: FormControl<string | null | undefined>;
  @Input() id = '';
  @Input() name?= '';

  getErrorMessage(): string {
    if (this.inputControl.errors?.['required']) return 'This field is required';
    if (this.inputControl.errors?.['email']) return 'Please enter a valid email';
    if (this.inputControl.errors?.['minlength'])
      return `Minimum length is ${this.inputControl.errors['minlength'].requiredLength}`;
    return 'Field is invalid';
  }
}
