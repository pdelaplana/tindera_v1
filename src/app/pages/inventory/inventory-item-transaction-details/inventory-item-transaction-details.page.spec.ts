import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventoryItemTransactionDetailsPage } from './inventory-item-transaction-details.page';

describe('InventoryItemTransactionDetailsPage', () => {
  let component: InventoryItemTransactionDetailsPage;
  let fixture: ComponentFixture<InventoryItemTransactionDetailsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryItemTransactionDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryItemTransactionDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
