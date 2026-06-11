import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { RevenueCardComponent } from '../revenue-card/revenue-card.component';
import { OrderService } from '../../services/order.service';
import { VendorRevenueDTO } from 'libs/CAuth/src/lib/dto/dtos';
import { ApiResponse } from '@erp/auth';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss'],
  imports: [CommonModule, RouterModule, RevenueCardComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class VendorDashboardComponent implements OnInit {
  showSidebar = true;
  userName = localStorage.getItem('WUName') || 'Vendor';
  revenueStats = { totalRevenue: 30000000, currentMonthRevenue: 1000000 };
  totalOrders = 100;
  menuStats: any;
  bestSellers: any;
  totalCurrentMonthOrder = 0;
  constructor(private router: Router, private orderService: OrderService) {}
  ngOnInit(): void {
    this.getVendorRevenueAndOrder();
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('WUName');
    this.router.navigate(['/auth/vendor']);
  }
  closeSidebar() {
    this.showSidebar = false;
  }
  getVendorRevenueAndOrder() {
    console.log('Fetching vendor revenue and order data');
    this.orderService.getVendorRevenueAndOrder().subscribe((response: any) => {
      console.log('Vendor revenue and order data received:', response);
      this.revenueStats = {
        totalRevenue: response.data.totalRevenue,
        currentMonthRevenue: response.data.monthlyRevenue,
      };
      this.totalOrders = response.data.totalOrder;
      this.totalCurrentMonthOrder = response.data.totalCurrentMonthOrder;
    });
  }
}
