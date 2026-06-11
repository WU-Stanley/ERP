import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CustomInputComponent,
  CustomTextareaComponent,
  SubmitRoundedButtonComponent,
  CustomSelectComponent,
  CancelRoundedButtonComponent,
  AlertService,
} from '@erp/core';
import { MenuItemService } from '../../services/menu-item.service';
import { FeedingTimeLst } from 'libs/CAuth/src/lib/dto/user.dto';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-menu-item',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomInputComponent,
    CustomTextareaComponent,
    SubmitRoundedButtonComponent,
    CustomSelectComponent,
    CancelRoundedButtonComponent,
  ],
  templateUrl: './create-menu-item.component.html',
  styleUrl: './create-menu-item.component.scss',
})
export class CreateMenuItemComponent implements OnInit {
  feedingTimes: FeedingTimeLst[] = [];
  mealMenuForm!: FormGroup;
  isProcessing = false;
  selectedImageString = signal('');
  constructor(
    private menuItemService: MenuItemService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.mealMenuForm = this.fb.group({
      mealName: ['', Validators.required],
      mealDescription: ['', Validators.required],
      mealPrice: [0, [Validators.required, Validators.min(0)]],
      feedingTimeId: ['', Validators.required],
      // vendorId: ['', Validators.required],
      mealImage: [null], // Optional file upload
      // imageUrl: ['', Validators.required],
    });

    console.log('Create Menu Item Component Loaded');
    this.getFeedingTimes();
  }
  getFeedingTimes() {
    this.menuItemService.getFeedingTimes().subscribe((response) => {
      console.log('Feeding times:', response);
      this.feedingTimes = response.data ?? [];
    });
  }
  submit() {
    this.isProcessing = true;
    if (this.mealMenuForm.valid) {
      const fD = new FormData();

      fD.append('mealName', this.mealMenuForm.value.mealName);
      fD.append('mealDescription', this.mealMenuForm.value.mealDescription);
      fD.append('mealPrice', this.mealMenuForm.value.mealPrice);
      fD.append('availableDate', this.mealMenuForm.value.availableDate);
      fD.append('feedingTimeId', this.mealMenuForm.value.feedingTimeId);
      // fD.append('vendorId', this.mealMenuForm.value.vendorId);
      // fD.append('imageUrl', this.mealMenuForm.value.imageUrl);

      if (this.mealMenuForm.value.mealImage) {
        fD.append('mealImage', this.mealMenuForm.value.mealImage);
      }

      console.log('Form Data:', fD);
      this.menuItemService.createMenuItem(fD).subscribe(
        (response) => {
          console.log('Menu item created successfully:', response);
          this.isProcessing = false;
          this.alertService.showSuccess('Menu item created successfully!');
        },
        (error) => {
          console.error('Error creating menu item:', error);
          this.isProcessing = false;
          this.alertService.showError('Failed to create menu item.');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Convert file to a previewable URL
      const reader = new FileReader();
      reader.onload = () => {
        // this.mealMenuForm.patchValue({ mealImage: reader.result });
        this.selectedImageString.set(reader.result as string);
        if (file) {
          this.mealMenuForm.patchValue({ mealImage: file });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  clear() {
    console.log('Clearing form');
    this.mealMenuForm = this.fb.group({
      mealName: ['', Validators.required],
      mealDescription: ['', Validators.required],
      mealPrice: ['0.0', [Validators.required, Validators.min(0)]],
      feedingTimeId: ['', Validators.required],
      // vendorId: ['', Validators.required],
      mealImage: [null], // Optional file upload
      // imageUrl: ['', Validators.required],
    });
  }
}
