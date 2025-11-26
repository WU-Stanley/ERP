import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';

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
  templateUrl: './edit-menu-item.component.html',
  styleUrl: './edit-menu-item.component.scss',
})
export class EditMenuItemComponent implements OnInit {
  feedingTimes: FeedingTimeLst[] = [];
  mealMenuForm!: FormGroup;
  isProcessing = false;
  selectedImageString = signal('');
  constructor(
    private menuItemService: MenuItemService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    const menuItemId = this.route.snapshot.paramMap.get('id');
    if (menuItemId) {
      this.loadMenuItem(menuItemId);
    }

    this.mealMenuForm = this.fb.group({
      id: [menuItemId || '', Validators.required],
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
  loadMenuItem(menuItemId: string) {
    this.menuItemService.getById(menuItemId).subscribe((response) => {
      console.log('Menu item details:', response);
      const menuItem = response.data;
      if (menuItem) {
        this.mealMenuForm.patchValue({
          mealName: menuItem.name,
          mealDescription: menuItem.description,
          mealPrice: menuItem.price,
          feedingTimeId: menuItem.feedingTimeId,

          // vendorId: menuItem.vendorId,
          // imageUrl: menuItem.imageUrl,
        });
        this.selectedImageString.set(menuItem.imageUrl || '');
      }
      console.log('meal image url:', this.selectedImageString());
      this.changeDetectorRef.detectChanges();
    });
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
      fD.append('id', this.route.snapshot.paramMap.get('id') || '');
      fD.append('mealName', this.mealMenuForm.value.mealName);
      fD.append('mealDescription', this.mealMenuForm.value.mealDescription);
      fD.append('mealPrice', this.mealMenuForm.value.mealPrice);
      fD.append('feedingTimeId', this.mealMenuForm.value.feedingTimeId);
      // fD.append('mealImage', this.mealMenuForm.value.mealImage);

      if (this.mealMenuForm.value.mealImage) {
        console.log(
          'Appending meal image to form data: ',
          this.mealMenuForm.value.mealImage
        );
        fD.append('mealImage', this.mealMenuForm.value.mealImage);
      }

      console.log('Form Data:', fD, this.mealMenuForm.value);
      this.menuItemService.updateMenuItem(fD).subscribe(
        (response) => {
          console.log('Menu item updated successfully:', response);
          this.isProcessing = false;
          this.alertService.showSuccess('Menu item updated successfully!');
        },
        (error) => {
          console.error('Error updating menu item:', error);
          this.isProcessing = false;
          this.alertService.showError('Failed to update menu item.');
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
