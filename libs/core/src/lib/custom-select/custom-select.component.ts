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
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements ControlValueAccessor {
  private _ngControl: any;

  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
  @Input() label = '';
  @Input() id = '';
  @Input() name = '';
  @Input() placeholder = 'Select...';
  @Input() width = '100%';
  @Input() height = 'auto';
  @Input() disabled = false;
  @Input() options: string[]|object[] = []; // List of items
  @Input() labelKey = ''; // If options are objects, specify which key to display
 
  @Input() value = '';
  @Output() valueChange = new EventEmitter<any>();

  searchTerm = '';
  filteredOptions: any[] = [];
  showDropdown = false;
  focused = false;
  constructor(private injector: Injector) {}

  ngOnInit() {
    this.setInitialValue();
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
  setInitialValue() {
    this.searchTerm = this.getLabel(this.value);
    this.filteredOptions = [...this.options];
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
  }

  onBlur() {
    setTimeout(() => {
      this.focused = false;
      this.showDropdown = false;
    }, 200); // allow time to select
  }

  selectOption(option: any) {
    this.value = option;
    this.searchTerm = this.getLabel(option);
    this.valueChange.emit(option);
    this.showDropdown = false;
  }

  isSelected(option: any): boolean {
    return this.getLabel(option) === this.getLabel(this.value);
  }

  getLabel(option: any) {
    return this.labelKey && option ? option[this.labelKey] : option;
  }

  hasError(): boolean {
    // Implement based on your validation logic
    return false;
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
