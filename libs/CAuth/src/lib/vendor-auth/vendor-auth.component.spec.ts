import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAuthComponent } from './vendor-auth.component';

describe('VendorAuthComponent', () => {
  let component: VendorAuthComponent;
  let fixture: ComponentFixture<VendorAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
