import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CAuthComponent } from './CAuth.component';

describe('CAuthComponent', () => {
  let component: CAuthComponent;
  let fixture: ComponentFixture<CAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CAuthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
