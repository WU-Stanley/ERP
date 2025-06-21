import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
 

@Component({
  selector: 'lib-submit-rounded-button',
  templateUrl: './submit-rounded-button.component.html',
  styleUrls: ['./submit-rounded-button.component.css'],
  imports:[SpinnerComponent]
})
export class SubmitRoundedButtonComponent  {
@Output() submitAction = new EventEmitter<void>();
@Input() disabled = false; 
@Input()label ="Submit"
@Input() isProcessing =false;
  constructor() { 
    // 
  }


submit() {
  this.submitAction.emit();
  console.log('Submit button clicked');
}
}
