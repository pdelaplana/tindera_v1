import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { InventoryCount } from '@app/models/inventory-count';
import { InventoryItem } from '@app/models/inventory-item';
import { User } from '@app/models/user';
import { AppState } from '@app/state';
import { selectAuthUser } from '@app/state/auth/auth.selectors';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryItem } from '@app/state/inventory/inventory.selectors';
import { NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-count',
  templateUrl: './inventory-count.page.html',
  styleUrls: ['./inventory-count.page.scss'],
})
export class InventoryCountPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  private user: User;

  itemId: string;
  item: InventoryItem;
  item$: Observable<InventoryItem>;
  inventoryCountForm : FormGroup;

  countTypes = [
    'End of Day',
    'Start of Day',
    'Cycle',
    'Adhoc',
    'Stocktake'
  ];

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private formBuilder: FormBuilder,
    private router: Router,
    private navController: NavController
  ) { 
    if (this.router.getCurrentNavigation().extras.state) {
      this.itemId = this.router.getCurrentNavigation().extras.state.itemId;
    } 
     
    this.store.select(selectAuthUser()).subscribe( user => this.user = user);
    
    this.store.select(selectInventoryItem(this.itemId)).subscribe(
      item => this.item = item
    );

    this.inventoryCountForm = this.formBuilder.group({
      count: [0, Validators.required],
      countOn: [new Date().toISOString(), Validators.required],
      countBy: [this.user],
      location: [''],
      type: [''],
      notes: ['']
    });

    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.submitCountSuccess),
        ).subscribe(action => {
          this.store.dispatch(inventoryActions.clearInventoryActions());
          const navigationExtras: NavigationExtras = { state: { itemId: this.item.id } };
          this.navController.navigateForward('inventory/details', navigationExtras);
        })
      )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }

  get count() { return this.inventoryCountForm.get('count'); }
  set count(value: any) { this.inventoryCountForm.get('count').setValue(value); }

  get countOn() { return this.inventoryCountForm.get('countOn'); }
  set countOn(value: any) { this.inventoryCountForm.get('countOn').setValue(value); }

  get countBy() { return this.inventoryCountForm.get('countBy'); }
  set countBy(value: any) { this.inventoryCountForm.get('countBy').setValue(value); }

  get notes() { return this.inventoryCountForm.get('notes'); }
  set notes(value: any) { this.inventoryCountForm.get('notes').setValue(value); }

  get type() { return this.inventoryCountForm.get('type'); }
  set type(value: any) { this.inventoryCountForm.get('type').setValue(value); }


  submit(){
    this.store.dispatch(inventoryActions.submitCount({
      count : <InventoryCount>{
        id:'',
        itemId: this.itemId,
        itemName: this.item.name,
        countOn: new Date(this.countOn.value),
        countBy: this.countBy.value,
        count: Number(this.count.value),
        type: this.type.value,
        notes: this.notes.value,
      }
    }))
  }

}
