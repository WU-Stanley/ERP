// revenue-card.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-revenue-card',
  templateUrl: './revenue-card.component.html',
  imports: [CommonModule],
})
export class RevenueCardComponent {
  @Input() title!: string;
  @Input() value!: any;
  @Input() icon = 'monetization_on';

  getFontSize(): string {
    const length = String(this.value).length;
    if (length <= 5) return 'text-3xl';
    if (length <= 8) return 'text-2xl';
    return 'text-xl';
  }
}
