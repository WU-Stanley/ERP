import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-custom-radio',
  templateUrl: './custom-radio.component.html',
})
export class CustomRadioComponent {
  @Input() value!: string;
  @Input() label!: string;
  @Input() checked = false;
  @Input() disabled = false;

  private onSelect!: (value: string) => void;

  registerOnSelect(fn: (value: string) => void) {
    this.onSelect = fn;
  }

  select() {
    if (!this.disabled && this.onSelect) {
      this.onSelect(this.value);
    }
  }
}
