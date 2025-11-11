import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuItem } from 'libs/CAuth/src/lib/dto/dtos';

@Component({
  selector: 'app-menu-item-detail',
  imports: [CommonModule],
  templateUrl: './Menu-Item-detail.component.html',
  styleUrl: './Menu-Item-detail.component.scss',
})
export class MenuItemDetailComponent {
  orderMeal(arg0: string) {
    throw new Error('Method not implemented.');
  }
  addToFavorites(arg0: string) {
    throw new Error('Method not implemented.');
  }
  meal: MenuItem | null = null;
  relatedMeals: any;

  constructor(
    private route: ActivatedRoute,
    private menuItemService: MenuItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.menuItemService.getById(id).subscribe((data) => {
        console.log('details:', data);
        console.log('details:', data);
        this.meal = data.data || null;
      });
    }
  }

  loadRelatedMeals(): void {
    this.menuItemService.getMenuItems().subscribe((allMeals) => {
      this.relatedMeals = (allMeals.data || []).filter(
        (m: any) => m.vendorId === this.meal?.vendorId && m.id !== this.meal?.id
      );
    });
  }
  backToList(id: string): void {
    this.router.navigate(['/student/dashboard/menu']);
  }
}
