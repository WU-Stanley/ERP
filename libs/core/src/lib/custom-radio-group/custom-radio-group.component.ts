import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  forwardRef,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomRadioComponent } from '../custom-radio/custom-radio.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
})
export class CustomRadioGroupComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
  @Input() name  = `custom-radio-group-${Math.random().toString(36).substring(2, 9)}`; // Unique name for grouping
  @Input()
  get value(): any {
    return this._value;
  }
  set value(val: any) {
    if (this._value !== val) {
      this._value = val;
      this.onChange(val);
      this.valueChange.emit(val);
      this.updateRadioStates();
    }
  }
  private _value: any = null;

  @Output() valueChange = new EventEmitter<any>();

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this._disabled = val;
    this.updateRadioStates();
  }
  private _disabled: boolean = false;

  @ContentChildren(forwardRef(() => CustomRadioComponent), { descendants: true })
  radios!: QueryList<CustomRadioComponent>;

  private destroy$ = new Subject<void>();

  constructor() {}

  ngAfterContentInit(): void {
    // Set initial properties for radios
    this.updateRadioStates();

    // Listen for changes in radios (e.g., if radios are added/removed dynamically)
    this.radios.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateRadioStates();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ControlValueAccessor methods
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this._value = obj;
    this.updateRadioStates();
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

  // Internal method to handle radio selection
  selectRadio(selectedValue: any): void {
    if (this.disabled) {
      return;
    }
    this.value = selectedValue;
    this.onTouched();
  }

  private updateRadioStates(): void {
    if (this.radios) {
      this.radios.forEach((radio) => {
        radio.disabled = this.disabled; // Propagate disabled state
        // The `checked` getter in CustomRadioComponent handles its own checked state
        // based on `this.radioGroup.value`
      });
    }
  }
}