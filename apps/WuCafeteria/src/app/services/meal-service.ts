import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  constructor(private http: HttpClient) {}
  getMealMenu(studentId: string) {
    return this.http.get(`/api/students/${studentId}/meal-menu`);
  }
}
