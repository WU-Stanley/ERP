import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
 
@Component({
  imports: [RouterModule,   ], 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  control=new FormControl()
  title = 'ERP';
  onSubmitClicked() {
    console.log('Submit button clicked in app component');
  }
}
