import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'libs/CAuth/src/lib/dto/dtos';
import { ApiResponse } from 'libs/CAuth/src/lib/ApiResponse';
import { A } from '@angular/cdk/activedescendant-key-manager.d-Bjic5obv';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  baseUrl = environment.apiUrl + '/menuitems';
  constructor(private http: HttpClient) {}

  getMenuItems() {
    return this.http.get<ApiResponse<Array<MenuItem>>>(
      this.baseUrl + '/GetAvailableMenuItems'
    );
  }
  orderMeal(id: string) {
    return this.http.post(`${this.baseUrl}/OrderMeal`, { id });
  }
  getById(id: string) {
    return this.http.get<ApiResponse<MenuItem>>(
      `${this.baseUrl}/GetMenuById?id=${id}`
    );
  }
}
