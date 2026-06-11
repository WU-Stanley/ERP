import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'lib-custom-radio-group',
  templateUrl: './custom-radio-group.component.html',
  styleUrls: ['./custom-radio-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomRadioGroupComponent),
      multi: true,
    },
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CustomRadioGroupComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: any[] = [];
  @Input() valueKey = 'id'; // 👈 key to use as value
  @Input() labelKey = 'name'; // 👈 key to use as display label
  @Input() disabled = false;

  value: any;
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  selectOption(value: any): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
