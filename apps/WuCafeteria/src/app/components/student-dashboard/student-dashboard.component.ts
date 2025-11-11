import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuItem } from 'libs/CAuth/src/lib/dto/dtos';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { MenuItemsComponent } from '../menu-items/Menu-Items.component';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
  imports: [RouterModule, CommonModule, MenuItemsComponent],
  standalone: true,
  providers: [provideCharts(withDefaultRegisterables())],
})
export class StudentDashboardComponent implements OnInit {
  logout() {
    throw new Error('Method not implemented.');
  }
  userName = localStorage.getItem('WUName') || 'Student';
  orders = [
    { id: '001', item: 'Ukasi Soup', date: '2025-11-03', amount: 1500 },
    { id: '002', item: 'Jollof Rice', date: '2025-10-31', amount: 2500 },
    { id: '003', item: 'Ukasi Soup', date: '2025-10-31', amount: 1500 },
  ];

  chartData = {
    labels: ['August', 'September', 'October', 'November'],
    datasets: [
      {
        label: 'Purchase Amount (₦)',
        data: [3000, 4500, 6000, 4000],
        backgroundColor: 'rgba(0, 120, 212, 0.6)',
      },
    ],
  };
  menuOpen = false;
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  apply(arg0: string) {
    throw new Error('Method not implemented.');
  }
  viewDetail(arg0: string) {
    throw new Error('Method not implemented.');
  }
  menuItems: MenuItem[] = [];
  constructor(
    private router: Router,
    private menuItemService: MenuItemService
  ) {}

  ngOnInit() {
    console.log('student dashboard: ');
    this.getMenuItems();
  }
  getMenuItems() {
    this.menuItemService.getMenuItems().subscribe((res) => {
      console.log('Menu Items: ', res);
      this.menuItems = res.data ?? [];
    });
  }
}
