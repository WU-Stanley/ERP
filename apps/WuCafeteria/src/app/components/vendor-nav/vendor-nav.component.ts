import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-vendor-nav',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './vendor-nav.component.html',
  styleUrl: './vendor-nav.component.scss',
})
export class VendorNavComponent {
  showSidebar = true;
  userName = localStorage.getItem('WUName') || 'Vendor';
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('WUName');
    this.router.navigate(['/auth/vendor']);
  }
  closeSidebar() {
    this.showSidebar = false;
  }
}
