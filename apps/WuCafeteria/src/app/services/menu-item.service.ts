import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'libs/CAuth/src/lib/dto/dtos';
import { ApiResponse } from 'libs/CAuth/src/lib/ApiResponse';

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
}
