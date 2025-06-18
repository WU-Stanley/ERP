import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-auth-dashboard',
  templateUrl: './auth-dashboard.component.html',
  styleUrls: ['./auth-dashboard.component.css'], 
   imports: [CommonModule, RouterModule],
})
export class AuthDashboardComponent implements OnInit {
  isCollapsed = false;

  constructor() {}

  ngOnInit() {}
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
