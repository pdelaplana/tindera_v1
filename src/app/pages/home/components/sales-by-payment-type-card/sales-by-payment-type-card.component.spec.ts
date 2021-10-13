import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalesByPaymentTypeCardComponent } from './sales-by-payment-type-card.component';

describe('SalesByPaymentTypeCardComponent', () => {
  let component: SalesByPaymentTypeCardComponent;
  let fixture: ComponentFixture<SalesByPaymentTypeCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesByPaymentTypeCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesByPaymentTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
