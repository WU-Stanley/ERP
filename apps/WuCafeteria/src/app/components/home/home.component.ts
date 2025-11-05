import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    console.log('home component initialized');
  }

  navigateTo(role: 'vendor' | 'student'): void {
    if (role === 'vendor') {
      this.router.navigate(['auth/vendor']);
    } else {
      this.router.navigate(['auth/student']);
    }
  }
}
