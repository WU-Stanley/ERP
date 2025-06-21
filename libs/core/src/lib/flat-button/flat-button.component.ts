import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'lib-flat-button',
  templateUrl: './flat-button.component.html',
  styleUrls: ['./flat-button.component.css'],
    imports:[SpinnerComponent]
  
})
export class FlatButtonComponent {
@Output() submitAction = new EventEmitter<void>();
@Input() disabled = false;
@Input() styles: { [key: string]: string } = {};
@Input() classList   = '';
@Input() label = 'Revoked';
@Input() isProcessing =false;

  constructor() { 
    // 
  }

  submit() {
    this.submitAction.emit();
    console.log('Submit button clicked');
  }

}
