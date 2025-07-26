import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  forwardRef,
  Injector,
  EventEmitter,
  Output,
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

  @Input() label = '';
  @Input() id = '';
  @Input() name = '';
  @Input() placeholder = 'Select...';
  @Input() width = '100%';
  @Input() height = 'auto';
  @Input() disabled = false;
  @Input() options: string[] | object[] = [];
  @Input() labelKey = '';
  @Input() fieldValue = '';
  @Output() valueChange = new EventEmitter<any>();

  searchTerm = '';
  filteredOptions: any[] = [];
  showDropdown = false;
  focused = false;
  private _value: any;

  onChange: (_: any) => void = () => {};
  onTouched: () => void = () => {};
  constructor(private injector: Injector) {}

  ngOnInit() {
    // this.setInitialValue();
    try {
      this._ngControl = this.injector.get(NgControl, null);
      if (this._ngControl) {
        this._ngControl.valueAccessor = this;
      }
    } catch (e) {
      // Swallow error if not used in a reactive form
    }
  }

  get value() {
    return this._value;
  }

  writeValue(value: any): void {
    this._value = value;
    this.searchTerm = this.getLabel(value);
    console.log('select value: ', value);
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
    this.setInitialValue()
  }

  onBlur() {
    setTimeout(() => {
      this.focused = false;
      this.showDropdown = false;
      this.onTouched();
    }, 200);
  }

  selectOption(option: any) { 
    this._value = option;
    this.searchTerm = this.getLabel(option);
    this.onChange(this.labelKey ? option['id'] : option);
    this.valueChange.emit(this.labelKey ? option['id'] : option);
    this.onTouched();
    this.showDropdown = false;
  }
  setValue(value: any) {
    this._value = value;
    this.searchTerm = this.getLabel(value);
    this.onChange(value);
    this.valueChange.emit(value);
    // console.log('select value 1: ', value);
  }

  isSelected(option: any): boolean {
    return this.getLabel(option) === this.getLabel(this.value);
  }

  getLabel(option: any): string {
    let label= this.labelKey && option ? option[this.labelKey] : option;
    console.log('option: ',option,' label ',label, ' labelKey: ',this.labelKey);
    if(!label && option && this.options.length){
      label = (this.options.find((a:any) =>a['id'] == option) as any)[this.labelKey]
    }
    console.log('final label: ',label)
    return label;
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
