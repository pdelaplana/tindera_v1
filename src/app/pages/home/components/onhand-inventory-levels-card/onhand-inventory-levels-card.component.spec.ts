import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnhandInventoryLevelsCardComponent } from './onhand-inventory-levels-card.component';

describe('OnhandInventoryLevelsCardComponent', () => {
  let component: OnhandInventoryLevelsCardComponent;
  let fixture: ComponentFixture<OnhandInventoryLevelsCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnhandInventoryLevelsCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnhandInventoryLevelsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
