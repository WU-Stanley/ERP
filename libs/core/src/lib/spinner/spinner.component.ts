import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class SpinnerComponent {
  @Input() size = 32;
  @Input() color = '#3b82f6'; // Tailwind blue-500
}
