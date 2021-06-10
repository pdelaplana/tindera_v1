import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { ShopActions } from '@app/state/shop/shop.actions';
import { MenuController, NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ErrorMessages } from 'src/app/services/error-messages';

@Component({
  selector: 'app-store-setup',
  templateUrl: './store-setup.page.html',
  styleUrls: ['./store-setup.page.scss'],
})
export class StoreSetupPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  storeSetupForm : FormGroup;

  errorMessages = ErrorMessages;

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private formBuilder: FormBuilder,
    private menuController: MenuController,
    private commonUIService: CommonUIService 
  ) { 
    this.menuController.enable(false);
    this.storeSetupForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      description: new FormControl(''),
      location: new FormControl('')
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription
      .add(
        this.actions.pipe(
          ofType(ShopActions.createShopSuccess)
        ).subscribe(action => {
          
          this.commonUIService.notify('Your store has been created.');
        })
      )
  }

  get name() { return this.storeSetupForm.get('name'); }
  get description() { return this.storeSetupForm.get('description'); }
  get location() { return this.storeSetupForm.get('location'); }

  save() {
    this.store.dispatch(ShopActions.createShop({
      name: this.name.value,
      description: this.description.value,
      location: this.location.value
    }))
  }

}
