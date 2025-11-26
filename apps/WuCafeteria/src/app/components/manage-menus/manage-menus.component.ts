import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuItem } from 'libs/CAuth/src/lib/dto/dtos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-menus',
  imports: [CommonModule],
  templateUrl: './manage-menus.component.html',
  styleUrl: './manage-menus.component.scss',
})
export class ManageMenusComponent implements OnInit {
  myMenus: MenuItem[] = [];

  constructor(
    private menuItemService: MenuItemService,
    private router: Router
  ) {}
  ngOnInit(): void {
    console.log('Manage Menus Component Loaded');
    this.getMyMenus();
  }
  getMyMenus() {
    const vendorId = localStorage.getItem('WUVendorId') || '';
    this.menuItemService.geMytMenuItems(vendorId).subscribe((response) => {
      console.log('Menu Items:', response);
      this.myMenus = response.data || [];
    });
  }
  edit(menuItem: MenuItem) {
    this.router.navigate(['/vendor/dashboard/edit-menu-item', menuItem.id]);
  }
  toggleAvailability(menuItem: MenuItem) {
    this.menuItemService
      .toggleAvailability(menuItem.id, !menuItem.isAvailable)
      .subscribe((response) => {
        console.log('Toggle Availability Response:', response);
        this.getMyMenus(); // Refresh the menu list
      });
  }
  delete(menuItem: MenuItem) {
    this.menuItemService.deleteMenuItem(menuItem.id).subscribe((response) => {
      console.log('Delete Menu Item Response:', response);
      this.getMyMenus(); // Refresh the menu list
    });
  }
  viewOrders(_t17: any) {
    throw new Error('Method not implemented.');
  }
  viewFulfilledOrders(_t17: any) {
    throw new Error('Method not implemented.');
  }
}
