import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventoryCountItemAdjustmentPage } from './inventory-count-item-adjustment.page';

describe('InventoryCountItemAdjustmentPage', () => {
  let component: InventoryCountItemAdjustmentPage;
  let fixture: ComponentFixture<InventoryCountItemAdjustmentPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryCountItemAdjustmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryCountItemAdjustmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
