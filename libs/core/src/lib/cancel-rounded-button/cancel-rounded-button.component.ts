import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-cancel-rounded-button',
  templateUrl: './cancel-rounded-button.component.html',
  styleUrls: ['./cancel-rounded-button.component.css']
})
export class CancelRoundedButtonComponent  {
@Output() cancelAction = new EventEmitter<void>();
@Input() disabled = false;
@Input() styles: { [key: string]: string } = {};
@Input() classList   = '';

  constructor() { 
    // 
  }

  cancel() {
    this.cancelAction.emit();
    console.log('Cancel button clicked');
  }

}
