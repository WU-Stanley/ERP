import { Component, Input, HostBinding, HostListener, ViewEncapsulation } from '@angular/core';
import { CustomRadioGroupComponent } from '../custom-radio-group/custom-radio-group.component';

@Component({
  selector: 'lib-custom-radio',
  templateUrl: './custom-radio.component.html',
  styleUrls: ['./custom-radio.component.scss'],
  encapsulation: ViewEncapsulation.None, // Important for global styles like ripple
})
export class CustomRadioComponent {
  @Input() value: any;
  @Input() label = '';
  @Input() disabled = false;
  @Input() color = '#673ab7'; // Default Material Purple (Indigo)

  // Internal state
  @HostBinding('class.custom-radio-checked')
  get checked(): boolean {
    return this.radioGroup?.value === this.value;
  }

  // Ripple effect properties (simplified for Material-like)
  rippleVisible = false;
  rippleTop = '0px';
  rippleLeft = '0px';

  constructor(private radioGroup: CustomRadioGroupComponent) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.disabled) {
      return;
    }
    this.radioGroup.selectRadio(this.value);
    this.showRipple(event);
  }

  private showRipple(event: MouseEvent) {
    this.rippleVisible = false; // Reset to trigger animation
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.rippleTop = `${event.clientY - rect.top}px`;
    this.rippleLeft = `${event.clientX - rect.left}px`;
    this.rippleVisible = true;

    // Hide ripple after a short delay
    setTimeout(() => {
      this.rippleVisible = false;
    }, 400); // Adjust duration to match Material's ripple
  }
}