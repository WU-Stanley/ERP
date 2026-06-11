import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorNavComponent } from './vendor-nav.component';

describe('VendorNavComponent', () => {
  let component: VendorNavComponent;
  let fixture: ComponentFixture<VendorNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
