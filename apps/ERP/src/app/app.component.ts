import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  router = inject(ActivatedRoute);
  control = new FormControl();
  title = 'ERP';
  contacts = ``;

  toFormat = ``;
  ngOnInit(): void {
    this.router.url.subscribe((res) => console.log('Current Navigation:', res));
  }

  onSubmitClicked() {
    console.log(this.toFormat);
  }
}
