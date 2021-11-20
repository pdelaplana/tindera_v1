import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InventoryCount } from '@app/models/inventory-count';
import { countTypes } from '@app/models/types';
import { User } from '@app/models/user';
import { AppState } from '@app/state';
import { selectAuthUser } from '@app/state/auth/auth.selectors';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { ModalController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-count-start-dialog',
  templateUrl: './inventory-count-start-dialog.page.html',
  styleUrls: ['./inventory-count-start-dialog.page.scss'],
})
export class InventoryCountStartDialogPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  private user: User;

  inventoryCountForm : FormGroup;

  countTypes = countTypes;

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
  ) { 
    this.store.select(selectAuthUser())
      .subscribe( user => this.user = user);
      
    this.inventoryCountForm = this.formBuilder.group({
      type: [''],
      notes: ['']
    });

    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.startInventoryCountSuccess)
        ).subscribe(action =>{
          this.modalController.dismiss({dismissed: true});
        })
      )


  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();

  }

  get notes() { return this.inventoryCountForm.get('notes'); }
  set notes(value: any) { this.inventoryCountForm.get('notes').setValue(value); }

  get type() { return this.inventoryCountForm.get('type'); }
  set type(value: any) { this.inventoryCountForm.get('type').setValue(value); }

  ngOnInit() {
  }

  submit(){
    this.store.dispatch(inventoryActions.startInventoryCount({
      count : <InventoryCount>{
        id:'',
        countOn: new Date(),
        user: this.user,
        countItems: [],
        type: this.type.value,
        notes: this.notes.value,
        archivedOn: null,
        submittedOn: null
      }
    }))
  }

  close(){
    this.modalController.dismiss({
      dismissed: true
    });
  }


}
