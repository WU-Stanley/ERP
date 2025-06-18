import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-flat-shaded-button',
  templateUrl: './flat-shaded-button.component.html',
  styleUrls: ['./flat-shaded-button.component.css']
})
export class FlatShadedButtonComponent {
@Output() submitAction = new EventEmitter<void>();
@Input() disabled = false;
 @Input() label = 'Assigned';

  constructor() { 
    // 
  }

  submit() {
    this.submitAction.emit();
    console.log('Submit button clicked');
  }
}
