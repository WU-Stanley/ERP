import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FavoriteMenu, MenuItem } from 'libs/CAuth/src/lib/dto/dtos';
import { ApiResponse } from 'libs/CAuth/src/lib/ApiResponse';
import { FeedingTimeLst } from 'libs/CAuth/src/lib/dto/user.dto';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  baseUrl = environment.apiUrl + '/menuitems';
  constructor(private http: HttpClient) {}

  deleteMenuItem(id: string) {
    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/DeleteMenuItem/${id}`
    );
  }
  toggleAvailability(menuId: string, isAvailable: boolean) {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/UpdateMenuItemAvailability?id=${menuId}&isAvailable=${isAvailable}`,
      {}
    );
  }
  createMenuItem(formData: any) {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/CreateMenuItem`,
      formData
    );
  }
  updateMenuItem(fD: FormData) {
    return this.http.put<ApiResponse<any>>(
      `${this.baseUrl}/UpdateMenuItem/?id=${fD.get('id')}`,
      fD
    );
  }
  getFavoriteMeals() {
    return this.http.get<ApiResponse<Array<FavoriteMenu>>>(
      this.baseUrl + '/GetFavoriteMeals'
    );
  }
  geMytMenuItems(vendorId: string) {
    return this.http.get<ApiResponse<Array<MenuItem>>>(
      this.baseUrl + '/GetMenuByVendor?vendorId=' + vendorId
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
  getFeedingTimes() {
    return this.http.get<ApiResponse<FeedingTimeLst[]>>(
      this.baseUrl + '/GetFeedingTimes'
    );
  }
}
