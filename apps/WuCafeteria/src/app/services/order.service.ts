import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ApiResponse } from 'libs/CAuth/src/lib/ApiResponse';
import { MealOrder, MealOrderDTO } from 'libs/CAuth/src/lib/dto/dtos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  route = environment.apiUrl + '/order';
  constructor(private http: HttpClient) {}

  confirmOrderReceived(id: string, userId: number) {
    const url = `${this.route}/ConfirmMealReceived/${id}?userId=${userId}`;
    return this.http.post<ApiResponse<any>>(url, {});
  }
  approveOrder(orderId: string, vendorId?: string) {
    const url = `${this.route}/Approve/${orderId}/Vendor/${vendorId}`;
    return this.http.put<ApiResponse<any>>(url, {});
  }
  placeOrder(studentId: string, mealId: string) {
    const url = `${this.route}/`;
    const body = { studentId, menuItemId: mealId };
    return this.http.post<ApiResponse<MealOrder>>(url, body);
  }
  getStudentOrderHistory(
    userId: number
  ): Observable<ApiResponse<MealOrderDTO[]>> {
    return this.http.get<ApiResponse<MealOrderDTO[]>>(
      `${this.route}/OrderHistory/Student/${userId}`
    );
  }
  getVendorOrderHistory(
    vendorId: string
  ): Observable<ApiResponse<MealOrderDTO[]>> {
    return this.http.get<ApiResponse<MealOrderDTO[]>>(
      `${this.route}/OrderHistory/Vendor/${vendorId}`
    );
  }
}
