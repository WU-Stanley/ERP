import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppSwitcherFabComponent } from '@erp/core';

@Component({
  imports: [RouterModule,AppSwitcherFabComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  control = new FormControl();
  title = 'ERP';
  contacts = ``;

  toFormat = ``;
  ngOnInit(): void {
    //      const set = new Set(data);
    //      console.log('new len: ',set)
    // let formattedTrimed = Array.from(set);
    // formattedTrimed = formattedTrimed.map(a => {
    //   let trimmed = a.replace(/\s+/g, '').trim();
    //   if (trimmed.length < 11) {
    //     return '0' + trimmed;
    //   }
    //   return trimmed;
    // });
    // console.log('set values: ', formattedTrimed);
    //     console.log('set len: ',set.size);
    //     const formatted = this.toFormat.split('\n').map(num => {
    //       num = num.trim();
    //       if (num.length < 11 && num.length > 0) {
    //       return '0' + num;
    //       }
    //       return num;
    //     }).filter(num => num.length > 0);
    //     console.log('new formatted: ',formatted);
  }

  onSubmitClicked() {
    console.log('Submit button clicked in app component');
  }
}
