import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { MealOrderDTO } from 'libs/CAuth/src/lib/dto/dtos';
import { Router } from '@angular/router';
import { SpinnerComponent } from '@erp/core';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
})
export class OrderHistoryComponent {
  mealOrders: MealOrderDTO[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private mealOrderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadMealOrders();
  }

  loadMealOrders(): void {
    const userId = 5; // Replace with actual logged-in user ID from auth
    this.mealOrderService.getStudentOrderHistory(userId).subscribe({
      next: (res) => {
        console.log('order history', res);
        this.mealOrders =
          res.data?.map((order) => ({ ...order, isProcessing: false })) ?? [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load meal order history.';
        console.error(error);
        this.isLoading = false;
      },
    });
  }
  viewDetails(order: MealOrderDTO) {
    this.router.navigate(['/student/dashboard/menu', order.menuItemId]);
  }
  confirmReceived(order: MealOrderDTO) {
    const userId = localStorage.getItem('WUStudentId');
    order.isProcessing = true;
    this.mealOrderService
      .confirmOrderReceived(order.id, Number(userId))
      .subscribe({
        next: (res) => {
          order.isProcessing = false;
          console.log('Order confirmed received:', res);
          alert('Order marked as received.');
          this.loadMealOrders(); // Refresh the order list
        },
        error: (error) => {
          order.isProcessing = false;
          console.error('Error confirming order received:', error);
          alert('Failed to confirm order received.');
        },
      });
  }
}
