import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemService } from '../../services/menu-item.service';
import { FavoriteMenu } from 'libs/CAuth/src/lib/dto/dtos';
import { SubmitRoundedButtonComponent } from '@erp/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-favorite-meal',
  imports: [CommonModule, SubmitRoundedButtonComponent],
  templateUrl: './favorite-meal.component.html',
  styleUrl: './favorite-meal.component.scss',
})
export class FavoriteMealComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  favorites: FavoriteMenu[] = [];

  constructor(
    private menuItemService: MenuItemService,
    private orderService: OrderService
  ) {}
  ngOnInit() {
    this.getFavoriteMeals();
  }

  getFavoriteMeals() {
    return this.menuItemService.getFavoriteMeals().subscribe((res) => {
      console.log('favorite res:', res);
      this.favorites = res.data ?? [];
    });
  }
  orderNow(menuItemId: string) {
    this.isLoading = true;
    const studentId = localStorage.getItem('WUStudentId') || '';
    this.orderService.placeOrder(studentId, menuItemId).subscribe((res) => {
      this.isLoading = false;
      console.log('Order response:', res);
      alert('Order placed successfully!');
    });
  }
}
