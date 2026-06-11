import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-submit-rounded-button',
  templateUrl: './submit-rounded-button.component.html',
  styleUrls: ['./submit-rounded-button.component.css'],
  imports: [SpinnerComponent, CommonModule],
  standalone: true,
})
export class SubmitRoundedButtonComponent {
  @Input() label = 'Submit';
  @Input() color = 'green'; // e.g., 'green', 'blue', 'red'
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() rounded = true;
  @Input() disabled = false;
  @Input() isProcessing = false;
  @Input() spinnerColor = '#10b981';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() customClass = ''; // ✅ user-defined extra CSS classes

  @Output() submitAction = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.isProcessing) {
      this.submitAction.emit();
    }
  }

  /** Compute the base Tailwind classes dynamically */
  get baseClasses(): string {
    const sizeClass =
      this.size === 'sm'
        ? 'py-1 px-3 text-sm'
        : this.size === 'lg'
        ? 'py-3 px-6 text-lg'
        : 'py-2 px-4 text-base';

    const roundedClass = this.rounded ? 'rounded-full' : 'rounded-md';
    const colorClass = `bg-${this.color}-800 hover:bg-${this.color}-900 focus:ring-${this.color}-600`;

    return `
      ${colorClass}
      ${sizeClass}
      ${roundedClass}
      text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75
      ${this.customClass}
    `.trim();
  }
}
