import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-custom-toggle',
  templateUrl: './custom-toggle.component.html',
  styleUrls: ['./custom-toggle.component.scss'],
  imports:[CommonModule]
})
export class CustomToggleComponent {
  @Input() label = 'Toggle Option';
  @Input() set initialChecked(value: boolean) {
    this._isChecked = value;
  }
  get isChecked(): boolean {
    return this._isChecked;
  }

  private _isChecked = false;

  @Output() toggled = new EventEmitter<boolean>();

  constructor() { }

  onToggleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this._isChecked = inputElement.checked;
    this.toggled.emit(this._isChecked);
    console.log('toggle ',this._isChecked)
  }
}