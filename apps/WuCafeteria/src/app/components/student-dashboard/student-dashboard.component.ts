import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuItem } from 'libs/CAuth/src/lib/dto/dtos';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
  imports: [RouterModule, CommonModule],
  standalone: true,
})
export class StudentDashboardComponent implements OnInit {
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
