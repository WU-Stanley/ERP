import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'lib-flat-shaded-button',
  templateUrl: './flat-shaded-button.component.html',
  styleUrls: ['./flat-shaded-button.component.css'],
  imports:[SpinnerComponent]
})
export class FlatShadedButtonComponent {
@Output() submitAction = new EventEmitter<void>();
@Input() disabled = false;
 @Input() label = 'Assigned';
@Input() isProcessing = false;

  constructor() { 
    // 
  }

  submit() {
    this.submitAction.emit();
    console.log('Submit button clicked');
  }
}
