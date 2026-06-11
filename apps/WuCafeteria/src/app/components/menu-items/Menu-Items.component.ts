import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuItem } from 'libs/CAuth/src/lib/dto/dtos';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { SubmitRoundedButtonComponent, FlatButtonComponent } from '@erp/core';

@Component({
  selector: 'app-menu-items',
  imports: [
    CommonModule,
    RouterModule,
    SubmitRoundedButtonComponent,
    FlatButtonComponent,
  ],
  templateUrl: './Menu-Items.component.html',
  styleUrls: ['./Menu-Items.component.scss'],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MenuItemsComponent {
  menuItems: MenuItem[] = [];
  isProcessing = false;
  constructor(
    private router: Router,
    private menuItemService: MenuItemService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    console.log('student dashboard: ');
    this.getMenuItems();
  }
  orderMeal(menuItemId: string) {
    console.log('Placing order for menu item id: ', menuItemId);
    this.isProcessing = true;
    const studentId = localStorage.getItem('WUStudentId') || '';
    this.orderService.placeOrder(studentId, menuItemId).subscribe((res) => {
      this.isProcessing = false;
      console.log('Order response: ', res);
      alert('Order placed successfully!');
    });
  }
  viewDetail(menuId: string) {
    this.router.navigate(['/student/dashboard/menu', menuId]);
  }
  getMenuItems() {
    this.menuItemService.getMenuItems().subscribe((res) => {
      console.log('Menu Items: ', res);
      this.menuItems = res.data ?? [];
    });
  }
}
