import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, Injector } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'lib-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['../custom-input/custom-input.component.scss'],
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true,
    },
  ],
})
export class CustomTextareaComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() id = '';
  @Input() name = '';
  @Input() disabled = false;

  value = '';
  focused = false;

  private _ngControl: NgControl | null = null;
  @Input() row = 1;

  constructor(private injector: Injector) {}

  ngOnInit() {
    try {
      this._ngControl = this.injector.get(NgControl, null);
      if (this._ngControl) {
        this._ngControl.valueAccessor = this;
      }
    } catch {
      //
    }
  }
  adjustHeight(textArea: HTMLTextAreaElement): void {
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
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
    const value = (event.target as HTMLTextAreaElement).value;
    this.value = value;
    this.onChange(value);
  }

  hasError(): boolean {
    return (
      !!this.formControl &&
      this.formControl.invalid &&
      (this.formControl.touched || this.formControl.dirty)
    );
  }

  get errorMessage(): string {
    const control = this.formControl;
    if (!control?.errors) return '';
    if (control.errors['required']) return 'This field is required.';
    return 'Invalid input.';
  }
}
