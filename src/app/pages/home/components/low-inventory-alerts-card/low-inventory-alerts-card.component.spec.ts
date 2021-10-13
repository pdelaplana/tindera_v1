import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LowInventoryAlertsCardComponent } from './low-inventory-alerts-card.component';

describe('LowInventoryAlertsCardComponent', () => {
  let component: LowInventoryAlertsCardComponent;
  let fixture: ComponentFixture<LowInventoryAlertsCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LowInventoryAlertsCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LowInventoryAlertsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
