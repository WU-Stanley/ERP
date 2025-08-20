import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'lib-custom-slide-toggle',
  templateUrl: './custom-slide-toggle.component.html',
  styleUrls: ['./custom-slide-toggle.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSlideToggleComponent),
      multi: true,
    },
  ],
  imports: [CommonModule],
})
export class CustomSlideToggleComponent implements ControlValueAccessor {
  @Input() color = 'bg-green-600'; // Tailwind green
  @Input() label = '';
  @Input() disabled = false;

  checked = false;

  onChange = (_: any) => {
    //
  };
  onTouched = () => {
    //
  };
  @Input() labelLocation: 'start' | 'end' = 'start';

  toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.checked = !!value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
