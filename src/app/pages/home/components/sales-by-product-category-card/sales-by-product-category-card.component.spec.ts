import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalesByProductCategoryCardComponent } from './sales-by-product-category-card.component';

describe('SalesByProductCategoryCardComponent', () => {
  let component: SalesByProductCategoryCardComponent;
  let fixture: ComponentFixture<SalesByProductCategoryCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesByProductCategoryCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesByProductCategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
