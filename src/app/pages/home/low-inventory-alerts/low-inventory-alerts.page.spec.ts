import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LowInventoryAlertsPage } from './low-inventory-alerts.page';

describe('LowInventoryAlertsPage', () => {
  let component: LowInventoryAlertsPage;
  let fixture: ComponentFixture<LowInventoryAlertsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LowInventoryAlertsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LowInventoryAlertsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
