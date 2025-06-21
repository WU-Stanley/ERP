import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SpinnerComponent } from '../spinner/spinner.component';
@Component({
  selector: 'lib-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.css'],
  imports: [SpinnerComponent],
})
export class SubmitButtonComponent {
  @Output() submitAction = new EventEmitter<void>();
  @Input() disabled = false;
  @Input() styles: { [key: string]: string } = {};
  @Input() classList = '';
  @Input() label = 'Submit';
  @Input() isProcessing = false;

  constructor() {
    //
  }

  submit() {
    this.submitAction.emit();
    console.log('Submit button clicked');
  }
}
