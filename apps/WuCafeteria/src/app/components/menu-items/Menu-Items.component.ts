import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuItem } from 'libs/CAuth/src/lib/dto/dtos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-items',
  imports: [CommonModule, RouterModule],
  templateUrl: './Menu-Items.component.html',
  styleUrl: './Menu-Items.component.scss',
})
export class MenuItemsComponent {
  orderMeal(menuItemId: string) {
    const studentId = localStorage.getItem('WUStudentId') || '';
    this.menuItemService.orderMeal(studentId, menuItemId).subscribe((res) => {
      console.log('Order response: ', res);
      alert('Order placed successfully!');
    });
  }
  viewDetail(menuId: string) {
    this.router.navigate(['/student/dashboard/menu', menuId]);
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
