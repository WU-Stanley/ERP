import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, Injector } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'lib-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() id = '';
  @Input() name = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() autocomplete = 'off';
  @Input() width='300px';
  @Input() height='2rem';
  value = '';
  focused = false;
  hidePassword = true;

  private _ngControl: NgControl | null = null;


  constructor(private injector: Injector) {}

  ngOnInit() {
    try {
      this._ngControl = this.injector.get(NgControl, null);
      if (this._ngControl) {
        this._ngControl.valueAccessor = this;
      }
    } catch (e) {
      // Swallow if not used in a reactive form
    }
  }

  get formControl(): FormControl | null {
    return this._ngControl?.control as FormControl;
  }

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  onChange: (val: any) => void = () => {
    // 
  };
  onTouched: () => void = () => {
    // 
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  get inputType(): string {
    return this.type === 'password' && this.hidePassword ? 'password' : this.type;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  hasError(): boolean {
    return !!this.formControl && this.formControl.invalid && (this.formControl.touched || this.formControl.dirty);
  }

  get errorMessage(): string {
    const control = this.formControl;
    if (!control?.errors) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Minimum length is ${requiredLength} characters.`;
    }
    if (control.errors['maxlength']) {
      const requiredLength = control.errors['maxlength'].requiredLength;
      return `Maximum length is ${requiredLength} characters.`;
    }
    if (control.errors['email']) return 'Enter a valid email address.';
    if (control.errors['pattern']) return 'Invalid format.';

    return 'Invalid input.';
  }
}
