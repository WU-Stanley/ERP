import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/Login/Login.component';
import { LmsAuthService } from './services/lms-auth.service';

@Component({
  imports: [LoginComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'LMS';

  constructor(private readonly authService: LmsAuthService) {}

  ngOnInit(): void {
    this.authService.completeMicrosoftCallbackFromUrl();
  }
}
