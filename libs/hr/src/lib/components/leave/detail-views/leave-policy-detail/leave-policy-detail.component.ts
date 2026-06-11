import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubmitRoundedButtonComponent, FlatButtonComponent } from '@erp/core';
import { LeavePolicyDto } from '../../../../dtos';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-leave-policy-detail',
  templateUrl: './leave-policy-detail.component.html',
  styleUrls: ['./leave-policy-detail.component.css'],
  imports: [
    SubmitRoundedButtonComponent,
    FlatButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LeavePolicyDetailComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('Leave Policy Detail Component Initialized');
  }
  @Input() leavePolicy!: LeavePolicyDto | null;
  @Output() editEvent = new EventEmitter<LeavePolicyDto>();
  @Output() closeEvent = new EventEmitter<void>();

  /**
   * Controls the visibility of the details overlay
   */
  isOpen = false;

  /**
   * Toggle the details panel open/close
   */
  toggleDetails(): void {
    this.isOpen = !this.isOpen;
    this.closeEvent.emit();
  }

  /**
   * Handler to edit the leave policy
   * (can emit an event to parent or open an edit form)
   */
  editPolicy(policy: LeavePolicyDto | null): void {
    if (!policy) return;

    this.editEvent.emit(policy);

    console.log('Edit leave policy:', policy);
  }
}
