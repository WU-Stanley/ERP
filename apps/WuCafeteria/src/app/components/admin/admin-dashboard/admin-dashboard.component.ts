import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Vendor {
  name: string;
  revenue: number;
  orderCount: number;
  status: 'active' | 'inactive' | string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  vendors: Vendor[] = [
    {
      name: 'Fresh Foods Co.',
      revenue: 12500.75,
      orderCount: 420,
      status: 'active',
    },
    { name: 'Daily Bites', revenue: 8320.5, orderCount: 310, status: 'active' },
    {
      name: 'Green Garden',
      revenue: 4025.0,
      orderCount: 120,
      status: 'inactive',
    },
    {
      name: 'Urban Eats',
      revenue: 15890.25,
      orderCount: 560,
      status: 'active',
    },
  ];

  totalRevenue = 0;
  activeVendorsCount = 0;
  averageRevenue = 0;

  ngOnInit(): void {
    this.calculateStats();
  }

  calculateStats(): void {
    this.totalRevenue = this.vendors.reduce(
      (sum, v) => sum + (v.revenue || 0),
      0
    );
    this.activeVendorsCount = this.vendors.filter(
      (v) => v.status === 'active'
    ).length;
    this.averageRevenue = this.vendors.length
      ? this.totalRevenue / this.vendors.length
      : 0;
  }

  viewDetails(vendor: Vendor): void {
    // placeholder — integrate real navigation/modal when needed
    console.log('View vendor', vendor);
  }
}
