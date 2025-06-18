import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-submit-rounded-button',
  templateUrl: './submit-rounded-button.component.html',
  styleUrls: ['./submit-rounded-button.component.css']
})
export class SubmitRoundedButtonComponent  {
@Output() submitAction = new EventEmitter<void>();
@Input() disabled = false; // Default value for disabled property
  constructor() { 
    // 
  }


submit() {
  this.submitAction.emit();
  console.log('Submit button clicked');
}
}
