import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteMealComponent } from './favorite-meal.component';

describe('FavoriteMealComponent', () => {
  let component: FavoriteMealComponent;
  let fixture: ComponentFixture<FavoriteMealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteMealComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
