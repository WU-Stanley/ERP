import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.css']
})
export class SubmitButtonComponent  {
@Output() submitAction = new EventEmitter<void>();
@Input() disabled = false;
@Input() styles: { [key: string]: string } = {};
@Input() classList   = '';

  constructor() { 
    // 
  }

  submit() {
    this.submitAction.emit();
    console.log('Submit button clicked');
  }
}
