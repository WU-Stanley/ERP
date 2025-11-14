import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FavoriteMenu, MenuItem } from 'libs/CAuth/src/lib/dto/dtos';
import { ApiResponse } from 'libs/CAuth/src/lib/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  baseUrl = environment.apiUrl + '/menuitems';
  constructor(private http: HttpClient) {}

  getFavoriteMeals() {
    return this.http.get<ApiResponse<Array<FavoriteMenu>>>(
      this.baseUrl + '/GetFavoriteMeals'
    );
  }
  getMenuItems() {
    return this.http.get<ApiResponse<Array<MenuItem>>>(
      this.baseUrl + '/GetAvailableMenuItems'
    );
  }
  orderMeal(studentId: string, mealId: string) {
    return this.http.post(`${this.baseUrl}/Order`, { studentId, mealId });
  }
  getById(id: string) {
    return this.http.get<ApiResponse<MenuItem>>(
      `${this.baseUrl}/GetMenuById?id=${id}`
    );
  }
  saveFavoriteMeal(menuItemId: string, userId: number) {
    return this.http.post<ApiResponse<FavoriteMenu>>(
      `${this.baseUrl}/SaveFavoriteMeal`,
      {
        menuItemId,
        userId,
      }
    );
  }
}
