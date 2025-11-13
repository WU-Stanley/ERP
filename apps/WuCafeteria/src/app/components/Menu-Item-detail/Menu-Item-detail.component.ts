import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuItem } from 'libs/CAuth/src/lib/dto/dtos';
import { AlertService } from 'libs/core/src/lib/alert.service';
import {
  FlatButtonComponent,
  FlatShadedButtonComponent,
  SubmitButtonComponent,
  SubmitRoundedButtonComponent,
} from '@erp/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-menu-item-detail',
  imports: [
    CommonModule,
    SubmitButtonComponent,
    SubmitRoundedButtonComponent,
    FlatButtonComponent,
  ],
  templateUrl: './Menu-Item-detail.component.html',
  styleUrl: './Menu-Item-detail.component.scss',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemDetailComponent {
  meal: MenuItem | null = null;
  relatedMeals: Array<MenuItem> = [];
  isProcessingOrder = false;
  isProcessingFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private menuItemService: MenuItemService,
    private orderService: OrderService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.menuItemService.getById(id).subscribe((data) => {
        console.log('details:', data);
        console.log('details:', data);
        this.meal = data.data || null;
        this.loadRelatedMeals();
      });
    }
  }
  orderMeal(mealId: string) {
    this.isProcessingOrder = true;
    const studentId = localStorage.getItem('WUStudentId') || '';
    this.orderService.placeOrder(studentId, mealId).subscribe(
      (res) => {
        console.log('Order response: ', res);
        this.alertService.showSuccess(res.message, [
          'bg-green-100',
          'text-green-800',
          'border',
          'border-green-200',
        ]);
        this.isProcessingOrder = false;
        this.router.navigate(['/student/dashboard/order-history']);
      },
      (error) => {
        console.log('Order error: ', error);
        this.isProcessingOrder = false;
        this.alertService.showError(error.error.message, [
          'bg-red-100',
          'text-red-800',
          'border',
          'border-red-200',
        ]);
        if (error.error.message.includes('Duplicate')) {
          this.router.navigate(['/student/dashboard/order-history']);
        }
      }
    );
  }
  addToFavorites(menuItemId: string) {
    this.isProcessingFavorite = true;
    const userId = Number(localStorage.getItem('WUStudentId')) || 0;
    this.menuItemService.saveFavoriteMeal(menuItemId, userId).subscribe(
      (res) => {
        this.isProcessingFavorite = false;
        console.log('Favorite response: ', res);
        this.alertService.showSuccess(
          res.message ?? 'Meal Menu saved as favorite',
          ['bg-green-100', 'text-green-800', 'border', 'border-green-200']
        );
      },
      (error) => {
        this.isProcessingFavorite = false;
        console.log('Favorite error: ', error);
        this.alertService.showError(
          error.error.message ?? 'Error saving menu item as favorite',
          ['bg-red-100', 'text-red-800', 'border', 'border-red-200']
        );
      }
    );
  }
  loadRelatedMeals(): void {
    this.menuItemService.getMenuItems().subscribe((allMeals) => {
      this.relatedMeals = (allMeals.data || []).filter(
        (m: MenuItem) =>
          m.vendorId === this.meal?.vendorId && m.id !== this.meal?.id
      );
    });
  }
  backToList(id?: string): void {
    this.router.navigate(['/student/dashboard/menu']);
  }
}
