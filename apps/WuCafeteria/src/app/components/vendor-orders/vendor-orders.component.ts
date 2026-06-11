import {
  Component,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { MealOrderDTO } from 'libs/CAuth/src/lib/dto/dtos';
import { SubmitRoundedButtonComponent, CustomInputComponent } from '@erp/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor-orders',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubmitRoundedButtonComponent,
    CustomInputComponent,
  ],
  templateUrl: './vendor-orders.component.html',
  styleUrl: './vendor-orders.component.scss',
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class VendorOrdersComponent implements OnInit {
  vendorOrders: MealOrderDTO[] = [];
  searchControl: FormControl = new FormControl('');
  isProcessing = false;
  isLoading = false;
  constructor(private orderService: OrderService) {}
  ngOnInit(): void {
    console.log('Vendor Orders Component Loaded');
    this.getVendorOrderHistory();
    this.searchControl.valueChanges.subscribe((value) => {
      console.log('Search control', value);
      this.filterOrders(value);
    });
  }
  filterOrders(value: any) {
    if (!value) {
      this.getVendorOrderHistory();
      return;
    }
    const filtered = this.vendorOrders.filter((order) =>
      order.orderCode.toLowerCase().includes(value.toLowerCase())
    );
    this.vendorOrders = filtered;
  }
  getVendorOrderHistory() {
    this.isLoading = true;
    const vendorId = localStorage.getItem('WUVendorId') || '';
    this.orderService.getVendorOrderHistory(vendorId).subscribe((response) => {
      console.log('Vendor Order History:', response);
      this.vendorOrders = response.data || [];
      this.isLoading = false;
    });
  }
  approveOrder(order: MealOrderDTO): void {
    this.isProcessing = true;
    const vendorId = localStorage.getItem('WUVendorId') || '';
    this.orderService.approveOrder(order.id, vendorId).subscribe(
      (res) => {
        console.log('Approve Order Response:', res);
        this.getVendorOrderHistory();
        this.isProcessing = false;
      },
      (error) => {
        console.log('error approving order: ', error);
        this.isProcessing = false;
      }
    );
  }
}
