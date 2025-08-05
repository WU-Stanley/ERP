import { Component, EventEmitter, Input,  Output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.css'],
  imports:[SpinnerComponent,CommonModule]
})
export class AddButtonComponent  {
 
@Output() submitAction = new EventEmitter<void>();
@Input() disabled = false;
@Input() styles: { [key: string]: string } = {};
@Input() classList   = '';
@Input() label = 'Add New';
@Input() isProcessing =false;
@Input() isFixed =false;

  constructor() { 
    // 
  }

  submit() {
    this.submitAction.emit();
    console.log('Submit button clicked');
  }

}
