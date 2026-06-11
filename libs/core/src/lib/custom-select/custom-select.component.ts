import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  forwardRef,
  Injector,
  EventEmitter,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'lib-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['../custom-select/custom-select.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements ControlValueAccessor {
  private _ngControl: NgControl | null = null;
  @Input() multiple = false;
  @Input() label = '';
  @Input() id = '';
  @Input() name = '';
  @Input() placeholder = 'Select...';
  @Input() width = '320px';
  @Input() height = 'autos';
  @Input() disabled = false;
  @Input() options: string[] | object[] = [];
  @Input() labelKey = '';
  @Input() valueKey = 'id';
  @Input() fieldValue = '';
  @Output() valueChange = new EventEmitter<any>();
  @Input() readonly = false;

  searchTerm = '';
  filteredOptions: any[] = [];
  showDropdown = false;
  focused = false;

  private _value: any = this.multiple ? [] : null;

  onChange: (_: any) => void = () => {
    //
  };
  onTouched: () => void = () => {
    //
  };
  constructor(private injector: Injector) {}

  ngOnInit() {
    // this.setInitialValue();
    try {
      this._value = this.multiple ? [] : null;

      this._ngControl = this.injector.get(NgControl, null);
      if (this._ngControl) {
        this._ngControl.valueAccessor = this;
      }
    } catch (e) {
      // Swallow error if not used in a reactive form
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && this.options?.length) {
      // Rebuild searchTerm when options change
      if (this.multiple) {
        this.searchTerm = this._value?.length
          ? this._value.map((v: string) => this.getLabel(v)).join(', ')
          : '';
      } else {
        this.searchTerm = this.getLabel(this._value);
      }
    }
  }
  get value() {
    return this._value;
  }

  writeValue(value: any): void {
    if (this.multiple) {
      if (Array.isArray(value)) {
        this._value = value;
      } else {
        this._value = value ? [value] : [];
      }
      this.searchTerm = this._value
        .map((v: string) => this.getLabel(v))
        .join(', ');
    } else {
      this._value = value;
      this.searchTerm = this.getLabel(value);
    }
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

  get formControl(): FormControl | null {
    return this._ngControl?.control as FormControl;
  }

  setInitialValue() {
    this.searchTerm = this.getLabel(this.value);
    this.filteredOptions = [...this.options];
    this.showDropdown = true;
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const term = input.value;
    this.searchTerm = term;
    const lowerTerm = term.toLowerCase();
    this.filteredOptions = this.options.filter((option) =>
      this.getLabel(option).toLowerCase().includes(lowerTerm)
    );
    this.showDropdown = true;
  }

  onFocus() {
    this.focused = true;
    this.showDropdown = true;
    this.setInitialValue();
  }

  onBlur() {
    setTimeout(() => {
      this.focused = false;
      this.showDropdown = false;
      this.onTouched();
    }, 200);
  }

  selectOption(option: any) {
    if (this.multiple) {
      const exists = this._value?.some((v: any) =>
        this.compareValues(v, option)
      );
      if (exists) {
        this._value = this._value.filter(
          (v: any) => !this.compareValues(v, option)
        );
      } else {
        this._value = [...this._value, option];
      }

      this.searchTerm = this._value
        .map((v: any) => this.getLabel(v))
        .join(', ');
      const emitVal = this.labelKey
        ? this._value.map((v: any) => v[this.valueKey])
        : this._value;
      this.onChange(emitVal);
      this.valueChange.emit(emitVal);
    } else {
      this._value = option;
      this.searchTerm = this.getLabel(option);
      const emitVal = this.labelKey ? option[this.valueKey] : option;
      this.onChange(emitVal);
      this.valueChange.emit(emitVal);
      this.showDropdown = false;
    }

    this.onTouched();
  }
  setValue(value: any) {
    this._value = value;
    this.searchTerm = this.getLabel(value);
    this.onChange(value);
    this.valueChange.emit(value);
    // console.log('select value 1: ', value);
  }

  isSelected(option: any): boolean {
    if (this.multiple) {
      return this._value?.some((v: any) => this.compareValues(v, option));
    }
    return this.getLabel(option) === this.getLabel(this.value);
  }

  compareValues(a: any, b: any): boolean {
    if (!a || !b) return false;
    if (this.labelKey)
      return (
        a[this.labelKey] === b[this.labelKey] ||
        a[this.valueKey] === b[this.valueKey]
      );
    return a === b;
  }
  getLabel(option: any): string {
    if (!option) return '';
    if (typeof option === 'object') {
      return this.labelKey ? option[this.labelKey] : option.toString();
    }

    // fallback: find object in options by id
    if (this.labelKey && this.options && Array.isArray(this.options)) {
      const found = (this.options as any[]).find(
        (o) => o[this.valueKey] == option
      );
      return found ? found[this.labelKey] : option;
    }

    return option;
  }

  removeSelected(option: any) {
    this._value = this._value.filter(
      (v: any) => !this.compareValues(v, option)
    );
    this.searchTerm = this._value.map((v: any) => this.getLabel(v)).join(', ');
    const emitVal = this.labelKey
      ? this._value.map((v: any) => v[this.valueKey])
      : this._value;
    this.onChange(emitVal);
    this.valueChange.emit(emitVal);
  }

  hasError(): boolean {
    const control = this.formControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
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
