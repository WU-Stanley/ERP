import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { RevenueCardComponent } from '../revenue-card/revenue-card.component';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss'],
  imports: [CommonModule, RouterModule, RevenueCardComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class VendorDashboardComponent {
  showSidebar = true;
  userName = localStorage.getItem('WUName') || 'Vendor';
  revenueStats = { totalRevenue: 30000000, currentMonthRevenue: 1000000 };
  totalOrders = 100;
  menuStats: any;
  bestSellers: any;
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('WUName');
    this.router.navigate(['/auth/vendor']);
  }
  closeSidebar() {
    this.showSidebar = false;
  }
  getVendorRevenueAndOrder() {}
}
